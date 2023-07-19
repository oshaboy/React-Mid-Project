import { useState } from 'react';
import {User} from './ServerUtils.ts'
export function CreateNewUserPanel(
	properties : {
		addUser: (_:User)=>void,
		isCreatingNewUserSetter:(_:boolean)=>void,
		idProposal:number
	}
){
	const [name, nameSetter] = useState("");
	const [email, emailSetter] = useState("");
	return <>
		<h3>Add New User</h3><br/>
		<div style={{
			borderStyle: "solid",
			borderColor : "#333333",
			padding: "2ch"
		}}>
			Name: <input type="text"
				value={name}
				onChange={e=>{nameSetter(e.target.value)}}/><br/>
			Email: <input type="text"
				value={email}
				onChange={e=>{emailSetter(e.target.value)}}/><br/>
			<button style={{backgroundColor:"#ffff99"}}
				onClick={()=>properties.isCreatingNewUserSetter(false)}
			>Cancel</button>
			<button style={{backgroundColor:"#ffff99"}}
			onClick={()=>properties.addUser(
				new User(
					properties.idProposal,
					name,
					email,
					{
						street: "",
						city : "",
						zipcode:""
					},
					[],
					[]
				)
			)}
			>Add</button>
		</div>
	</>;
}