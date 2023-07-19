import axios from "axios";
export type Address = { street: string; city:string; zipcode:string;};
export type Post = {id: number, title:string, body : string};
export type Todo = {id: number, title:string, completed : boolean};
export class User{
	_id: number;
	_name: string;
	_email : string;
	_address : Address;
	
	_todos:Todo[];

	_posts:Post[];
	constructor(
		id:number,
		name:string,
		email:string,
		address:Address,
		todos : Todo[],
		posts : Post[]
	){
		this._id=id;
		this._name=name;
		this._email=email;
		this._address=address;
		this._todos=todos;
		this._posts=posts;

	}
	get id() : number{
		return this._id;
	}

	get email(): string{
		return this._email;
	}

	get name() : string{
		return this._name;
	}

	get street() : string{
		return this._address.street;
	}

	get city() : string{
		return this._address.city;
	}

	get zipcode() : string{
		return this._address.zipcode;
	}

	get address() : Address{
		return this._address;
	}
	get todos() : Todo[] {
		return this._todos;
	}

	get posts() : Post[] {
		return this._posts;
	}
	/*
	 * The name isn't quite right, it creates a new user that is identical except the todo is completed 
	 * User is immutable because React requires immutability
	 */
	setTaskAsCompleted(idx : number) : User{
		const new_todos=[...this._todos];
		new_todos[idx].completed=true;
		return new User(
			this._id,
			this._name,
			this._email,
			this._address,
			new_todos,
			this._posts

		);
	}
	setNewDeets(
		new_name:string,
		new_email:string,
		new_address:Address
	) : User {
		return new User(
			this._id,
			new_name,
			new_email,
			new_address,
			this._todos,
			this._posts

		);}
	hasUncompletedTasks():boolean{
		return !this._todos.every(todo=>{return todo.completed});
	}
	addTodo(todo: Todo) : User{
		return new User(
			this._id,
			this._name,
			this._email,
			this._address,
			[...this._todos, todo],
			this._posts
		);
	}
	addPost(post: Post) : User{
		return new User(
			this._id,
			this._name,
			this._email,
			this._address,
			this._todos,
			[...this._posts, post]
		);
	}
};

const url="https://jsonplaceholder.typicode.com";
export function PollUsers() : Promise<User[]>{
	return axios.get(`${url}/users`).then(
		response=>{return new Promise(async (resolve, reject)=>
		{
			if (response.status != 200) reject();
			
			const users : User[]=await Promise.all(response.data.map(
				async (user : any)=>{
					const todos=(await axios.get(`${url}/users/${user.id}/todos`)).data;
					const posts=(await axios.get(`${url}/users/${user.id}/posts`)).data;
					return new User(
						user.id,
						user.name,
						user.email,
						user.address,
						todos,
						posts
					);
				}
			));
			resolve(users);
		}
		);},
		_=>{return [];}
	);
}
