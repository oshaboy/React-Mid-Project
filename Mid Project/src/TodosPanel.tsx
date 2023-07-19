import { useState } from "react";
import { Todo,Post, User } from "./ServerUtils"

function AddTodoComponent(properties: {
		addtodo_func: (_:Todo)=>void,
		cancel : ()=>void,
		id_proposal : number
	}
){
	const [title, titleSetter]=useState("");
	return <div style={{margin: "2ch"}}>
		Title: <input type="text" onChange={e=>{titleSetter(e.target.value)}}/><br/>
		<button style={{backgroundColor:"#ffff99"}} onClick={
			()=>{properties.addtodo_func({
				id : properties.id_proposal,
				title: title,
				completed : false
			})}
		}> Add </button>
		<button style={{backgroundColor:"#ffff99"}} onClick={
			()=>{properties.cancel();}
		}> Cancel </button>
	</div>;
}

function AddPostComponent(properties: {
	addpost_func: (_:Post)=>void,
	cancel : ()=>void,
	id_proposal : number
}
){
	const [title, titleSetter]=useState("");
	const [body, bodySetter]=useState("");
	return <div style={{margin: "2ch"}}>
		Title: <input type="text" onChange={e=>{titleSetter(e.target.value)}}/><br/>
		Body: <textarea
			style={{float:"none",rows:"6", cols:"100"}}
			onChange={e=>{bodySetter(e.target.value)}}
		/><br/>
		<button style={{backgroundColor:"#ffff99"}} onClick={
			()=>properties.addpost_func({
				id : properties.id_proposal,
				title: title,
				body : body

			})}
		> Add </button>
		<button style={{backgroundColor:"#ffff99"}} onClick={
			()=>properties.cancel()
		}> Cancel </button>
	</div>;
}

function TodoComponent (properties : {
	todo: Todo, setAsCompleted : ()=>void
}){
	return <p style={{
		borderStyle: "solid",
		borderColor : "#993366",
		margin:"2ch"
	}}>

		Title: {properties.todo.title} <br/>
		Completed: {properties.todo.completed?"Yes":"No"}
		<button
			style={{
				float: "right",
				fontSize:"8px",
				height:"auto",
				backgroundColor:"#ffff99"
			}}
			onClick={properties.setAsCompleted}
		>Mark as Completed</button><br/>
	</p>;
};


function PostComponent (properties : {
	post: Post
}){
	return <p style={{
		borderStyle: "solid", borderColor : "#993366", margin:"2ch"
	}}>
		Title: {properties.post.title} <br/>
		Body: {properties.post.body} <br/>
	</p>;
};

export function TodosAndPostsPanel(properties:
	{
		currentUser:User,
		currentUserSetter : (_:User)=>void
	}){
	const currentUser=properties.currentUser;
	const [isAddingTodo, isAddingTodoSetter] = useState(false);
	const [isAddingPost, isAddingPostSetter] = useState(false);
	if (currentUser.posts && currentUser.todos){
		return <>
			<h3>Todos - User {properties.currentUser.id}
			<button
				style={{float: "right", backgroundColor:"#ffff99"}}
				onClick={()=>{isAddingTodoSetter(true)}}
			>Add</button>
			</h3>
			
			<br/>
			<div style={{
				borderStyle: "solid", borderColor : "#999999", margin:"2ch"
			}}>
				
				{(()=>{
				if (isAddingTodo) {
					return <AddTodoComponent
						addtodo_func={(todo:Todo)=>{
							properties.currentUserSetter(currentUser.addTodo(todo));
							isAddingTodoSetter(false);
						}}
						id_proposal={currentUser.todos.reduce((currentMin, todo)=>{
							return (currentMin==todo.id)?todo.id+1:currentMin;
						}, 1)}
						cancel={()=>isAddingPostSetter(false)}
					/>;
				} else /*(isAddingTodo)*/ {
					return currentUser.todos.map((todo,idx)=>{
						return <TodoComponent
							todo={todo}
							setAsCompleted={()=>{
								properties.currentUserSetter(currentUser.setTaskAsCompleted(idx));
							}}
						/>}
					);
				}
				})()}
			</div>

			
			<h3>Posts - User {properties.currentUser.id}
			<button
				style={{float: "right", backgroundColor:"#ffff99"}}
				onClick={()=>{isAddingPostSetter(true)}}
			>Add</button>
			</h3> <br/>
			<div style={{
				borderStyle: "solid", borderColor : "#999999"
			}}>
				
			{(()=>{
			if (isAddingPost){
				return <AddPostComponent 
					addpost_func={(post:Post)=>{
						properties.currentUserSetter(currentUser.addPost(post));
						isAddingPostSetter(false);
					}}
					/* Find Smallest ID not used by any post */
					id_proposal={currentUser.posts.reduce((currentMin, post)=>{
						return (currentMin==post.id)?post.id+1:currentMin;
					}, 1)}
					cancel={()=>isAddingPostSetter(false)}
				/>
			} else /*(isAddingPost)*/ {
				return currentUser.posts.map(post=>{
					return <PostComponent
						post={post}
					/>}
				);
			}
			})()}

			</div>
		</>;
	} else {
		return <h1>Loading</h1>;
	}
}