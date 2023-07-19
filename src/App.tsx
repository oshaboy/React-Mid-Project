import {ReactElement, useEffect, useState } from 'react'
import {User, PollUsers} from './ServerUtils.ts'
import {UserComponent} from './UserComponent.tsx'
import { TodosAndPostsPanel } from './TodosPanel.tsx';
import { CreateNewUserPanel } from './CreateNewUserPanel.tsx';
import './App.css';

function UsersComponent(properties : {
	users : User[],
	currentActiveUser : number | null,
	deleter: (idx: number)=>void,
	updater: (idx:number, new_user:User)=>void,
	currentActiveUserSetter : (_:number|null)=>void,
	isCreatingNewUserSetter : (_:boolean)=>void
}) { 
	const users=properties.users;
	const [searchBarContents, searchBarContentsSetter] = useState("");
	return <div style={
		{
			borderStyle: "solid",
			borderColor : "#990000",
			padding: "2ch"
		}
	}>
		Search: <input type="text"
		onChange={e=>searchBarContentsSetter(e.target.value)}
		/>
		<button style={{backgroundColor:"#ffff99"}}
		 onClick={()=>properties.isCreatingNewUserSetter(true)}
		>Add</button><br/>


		{users.filter((user)=>{
			return user.name.includes(searchBarContents) ||
				user.email.includes(searchBarContents);
		}).map((user,idx)=>{
			return <>
				<UserComponent 
					key={user.id}
					user={user}
					isActiveUser={properties.currentActiveUser == user.id}
					deleter={()=>{properties.deleter(idx)}}
					updater={(user :User)=>{properties.updater(idx, user)}}
					currentActiveUserSetter={properties.currentActiveUserSetter}
				/><br/>
			</>})}
		
	</div>;
}


function App() : ReactElement {
	const [users, usersSetter] = useState<User[] | undefined>(undefined);
	const [currentActiveUser, currentActiveUserSetter] = useState<number|null>(null);
	const [isCreatingNewUser, isCreatingNewUserSetter] = useState<boolean>(false);

	useEffect(()=>{
		/* Handle all the "server" stuff */
		PollUsers().then(usersSetter);
	}, []);

	if (users){
		return <>
			<div style={{float: "left",width: "400px",margin:"2ch",padding: "2ch"}}>
				<UsersComponent
					users={users}
					deleter={(idx: number)=>{
						if (users){
							const new_arr=users.slice(0,idx).
								concat(users.slice(idx+1,users.length));
							usersSetter(new_arr);
						}
					}}
					updater={(idx:number, new_user:User)=>{
						if (users){
							let new_arr=[...users];
							new_arr[idx]=new_user;
							usersSetter(new_arr);
						}
					}}
					currentActiveUser={currentActiveUser}
					currentActiveUserSetter={(id)=>{
						isCreatingNewUserSetter(false);
						currentActiveUserSetter(id==currentActiveUser?null:id);
						
					}}
					isCreatingNewUserSetter={
						(b:boolean)=>{
							currentActiveUserSetter(null);
							isCreatingNewUserSetter(b);
						}
					}
				/>
			</div>
			<div style={{
					float: "left",
					width: "700px"
					,margin:"2ch",
					padding: "2ch"
				}}>
				{(()=>{
					if(currentActiveUser != null) {
						return <TodosAndPostsPanel
							currentUser={
								users.find(user=>{return user.id == currentActiveUser})!!
							}
							currentUserSetter={(new_user:User)=>{
								const idx=users.findIndex(
									user=>{return user.id == currentActiveUser}
								);
								const new_users=users.with(idx, new_user);
								usersSetter(new_users);
							}}
						/>
					} else if (isCreatingNewUser){
						return <CreateNewUserPanel
							addUser={(user:User)=>{
								usersSetter([...users, user]);
								isCreatingNewUserSetter(false);
							}}
							isCreatingNewUserSetter={isCreatingNewUserSetter}
							/* Find Smallest ID not used by any user */
							idProposal={users.reduce((currentMin, user)=>{
								return (currentMin==user.id)?user.id+1:currentMin;
							}, 1)}
						/>
					} else {
						return null;
					}
				})()}
			</div>  
		</>;
	} else {
		return <h1>Loading</h1>;
	}
}

export default App
