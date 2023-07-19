
import {ReactElement, useState } from 'react'
import {Address,User} from './ServerUtils.ts'
function OtherData(properties:
	{address: Address,
	addressSetter:React.Dispatch<React.SetStateAction<Address>>}
	){
	const the_address = properties.address;
	return <>
		Street:<input type="text"
			value={the_address.street}
			onChange={e=>{
				const new_address={...the_address, street: e.target.value}
				properties.addressSetter(new_address)
			}}
		/><br/>
		City:<input type="text"
			value={the_address.city}
			onChange={e=>{
				const new_address={...the_address, city: e.target.value}
				properties.addressSetter(new_address)
			}}
		/><br/>
		Zip Code:<input type="text"
			value={the_address.zipcode}
			onChange={e=>{
				const new_address={...the_address, zipcode: e.target.value}
				properties.addressSetter(new_address)
			}}
		/><br/>
	</>;
}


export function UserComponent(properties : {
	user: User,
	isActiveUser: boolean,
	deleter: ()=>void,
	updater: (_:User)=>void,
	currentActiveUserSetter: (_:number|null)=>void
  }) : ReactElement {
	const user=properties.user;
	const [toShowOtherData, toShowOtherDataSetter] = useState<boolean>(false);
	const toggleData=()=>{
	  toShowOtherDataSetter(!toShowOtherData);
	};
	
	const [name, nameSetter] = useState<string>(user.name);
	const [email, emailSetter] = useState<string>(user.email);
	const [address, addressSetter] = useState<Address>(user.address);
	const hasUncompletedTasks = user.hasUncompletedTasks();
	return <>
		<div style={
			(()=>{
			const borderColor = hasUncompletedTasks ? "#cc3333" : "#33cc33";
			const backgroundColor = properties.isActiveUser ? "#ff9933" : "#ffffff"
			return {
				borderStyle:"solid",
				borderColor:borderColor,
				backgroundColor: backgroundColor,
				borderWidth: 2
			}})()
		}>
			<label onClick={_=>{properties.currentActiveUserSetter(user.id)}}>ID:</label> {user.id}<br/>
			Name: <input
				type="text"
				value={name}
				onChange={e=>{nameSetter(e.target.value);}}
			/><br/>
			Email: <input
				type="text"
				value={email}
				onChange={e=>{emailSetter(e.target.value);}}
			/><br/>
			<button
				style={{backgroundColor:"#ffff99"}}
				onClick={toggleData}
			>Other Data</button>
			{(()=>{
				if (toShowOtherData){
					return (<><br/><OtherData
						address={address}
						addressSetter={addressSetter}
					/></>);
				} else {
					return null;
				}
			})()}
			<button
				style={{backgroundColor:"#ffff99"}}
				onClick={()=>{properties.updater(
					user.setNewDeets(
						name,
						email,
						address
					)
				)}}
			>Update</button>
			<button
				style={{backgroundColor:"#ffff99"}}
				onClick={properties.deleter}
			>Delete</button>
		</div>
	</>;
}