---
title: React 快速上手
sidebar_position: 10
---


从 cdn 引入 react 和 babel

```html
<!DOCTYPE html>
<html>
    <head>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script crossorigin src="https://unpkg.com/babel-standalone@6.26.0/babel.min.js"></script> 
    </head>
    <body>
        <div id="root"></div>
        <script type="text/babel">
            const root = ReactDOM.createRoot(document.getElementById("root"))
            root.render(<h1>hello</h1>)
        </script>
    </body>
</html>
```

组件有类组件和函数组件，函数组件更优雅也更常用。

定义一个类组件，继承 `React.Component` ，实现 render 方法用于渲染，render 括号返回内容用括号包裹。变量可以用大阔号获取。

```html
<script type="text/babel">
    const root = ReactDOM.createRoot(document.getElementById("root"))
    const pokemons = ["皮卡丘", "可达鸭", "小火龙"]
    class App extends React.Component {
        
        render() {
            return (
                <div>
                    <h1>宝可梦</h1>
                    <ul>
                        { pokemons.map(pokemon => <li>{pokemon}</li>) }
                    </ul>
                </div>    
            );
        }
    }
    root.render(<App />)
</script>
```

组件可以有 state ，可以用于存放数据

```html
<script type="text/babel">
    const root = ReactDOM.createRoot(document.getElementById("root"))
    class App extends React.Component {
        constructor() {
            super()
            this.state = {
                pokemons : ["皮卡丘", "可达鸭", "小火龙"]
            }
        }
        render() {
            return (
                <div>
                    <h1>宝可梦</h1>
                    <ul>
                        { this.state.pokemons.map((pokemon, index) => <li key={index}>{pokemon}</li>) }
                    </ul>
                </div>    
            );
        }
    }
    root.render(<App />)
</script>
```

数据改为从后端获取，类组件的 componentDidMount 方法可以在组件挂载后运行

```js
const root = ReactDOM.createRoot(document.getElementById("root"))
class App extends React.Component {
    constructor() {
        super()
        this.state = {
            pokemons : ["皮卡丘", "可达鸭", "小火龙"]
        }
    }
    componentDidMount() {
        fetch('https://pokeapi.co/api/v2/pokemon')
            .then(res => res.json())
            .then( json => this.setState({pokemons: json.results.map(e => e.name)}) )
    }
    render() {
        return (
            <div>
                <h1>宝可梦</h1>
                <ul>
                    { this.state.pokemons.map((pokemon, index) => <li key={index}>{pokemon}</li>) }
                </ul>
            </div>    
        );
    }
}
root.render(<App />)
```

可以把组件放在单独的文件，更优雅

index.html

```html
<div id="root"></div>
<script type="text/babel" src="src/App.js"></script>
<script type="text/babel" src="src/index.js"></script>
```

src/index.js

```js
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App />)
```

src/App.js

```js
class App extends React.Component {
    constructor() {
        console.log("constructor")
        super()
        this.state = {
            pokemons : ["皮卡丘", "可达鸭", "小火龙"]
        }
    }
    componentDidMount() {
        console.log("componentDidMount")
        fetch('https://pokeapi.co/api/v2/pokemon')
            .then(res => res.json())
            .then( json => this.setState({pokemons: json.results.map(e => e.name)}) )
    }
    render() {
        console.log("render")
        return (
            <div>
                <h1>宝可梦</h1>
                <ul>
                    { this.state.pokemons.map((pokemon, index) => <li key={index}>{pokemon}</li>) }
                </ul>
            </div>    
        );
    }
}
```

事件

定义一个函数，在输入框改变时候运行，onChange 方法类似 on-change 方法

```js
onChangeHandler = (e) => {
        const filtered = this.state.pokemons.filter(p => {
            return p.includes(e.target.value)
        })
        this.setState(
            {filteredPokemons: filtered}
        )
    }
    render() {
        console.log("render")
        return (
            <div>
                <h1>宝可梦</h1>
                <input type="text" onChange={ this.onChangeHandler }></input>
                <ul>
                    { this.state.filteredPokemons.map((pokemon, index) => <li key={index}>{pokemon}</li>) }
                </ul>
            </div>    
        );
    }
```

组件可以复用，可以进行嵌套，并可以用 props 传递参数

```html
<script type="text/babel" src="src/components/Input.jsx"></script>
<script type="text/babel" src="src/components/List.jsx"></script>
<script type="text/babel" src="src/App.js"></script>
<script type="text/babel" src="src/index.js"></script>
```

两个 jsx 组件

```jsx
class List extends React.Component {
    render() {
        const { pokemonList } = this.props;
        return (
            <ul>
                { pokemonList.map( (p, index) => <li key={index}>{p}</li>) }
            </ul>
        )
    }
}
class Input extends React.Component {
    render() {
        const {handler} = this.props
        return <input type="text" onChange={handler} />
    }
}
```

在 App 组件中嵌套 List 和 Input 组件

```js
render() {
    console.log("render")
    return (
        <div>
            <h1>宝可梦</h1>
            <Input handler={this.onChangeHandler} />
            <List pokemonList={this.state.filteredPokemons} />
        </div>    
    );
}
```


接下来把 App 改为函数式组件，函数式组件不再有 this ，但可以通过 useState 设置渲染的对象。useEffect 可以让函数执行一次，第二个参数配置什么时候重复执行，传入空数组表示这个函数只执行一次。

```js
const App = () => {
    const [pokemons, setPokemons] = React.useState(["皮卡丘", "可达鸭", "小火龙"])
    const [filteredPokemons, setFilteredPokemons] = React.useState([...pokemons])
    const onChangeHandler = (e) => {
        const filtered = pokemons.filter(p => {
            return p.includes(e.target.value)
        })
        setFilteredPokemons(filtered)
    }
    React.useEffect(() => {
        fetch('https://pokeapi.co/api/v2/pokemon')
            .then(res => res.json())
            .then( json => {
                const fetchedPokemons = json.results.map(e => e.name)
                setPokemons(fetchedPokemons)
                setFilteredPokemons(fetchedPokemons)
            })
    }, [])
  
    return (
        <div>
            <h1>宝可梦</h1>
            <Input handler={onChangeHandler} />
            <List pokemonList={filteredPokemons} />
        </div>    
    )
}
```

List 组件也可以改为函数式组件，也可以用更简洁的方式 `const List = ({pokemonList}) => {}`

```js
const List = (props) => {
    const { pokemonList } = props
    return (
        <ul>
            { pokemonList.map( (p, index) => <li key={index}>{p}</li>) }
        </ul>
    )
}
```

---

NodeJs 版快速上手

Use create-react-app to create a react project.

```
npx create-react-app my-blog
```

Dependencies will download in node_module folder. If we delete this folder, we can use command `npm install` to download the dependencies. Normally the module folder is not under version control, if we download a project from github we can run this command to download modules.


Start a local development server so we can preview our web application.

```
npm start
```

If we inspect the page, we can see a div with id 'root' and a div with class 'app' rendered in it.

```html
<div id="root">
  <div class="App">
  ...
  </div>
</div>
```

Index.js takes this element and renders it to element root.
```js
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

There are 2 types of template. One is functional template. At the end of the component we export this component so that it can be used in other files.

```js
function App(){
  return (
    <div className="App">
      <h1>Hello World</h1>
    </div>
  );
}

export default App
```

We can use curly braces to reference variables in JSX. React will convert it to string before outputs it to browser, but boolean and object will not be converted. We can write javascript statement in curly braces. If we pass an array, all the elements will be bunch together and output a string.

Vscode extention ES7+ React/Redux/React-Native snippets helps generate code easily. For example, `rafce` generate a react array function export component.

```js
const name = 'Jeff';
const age = 32;
const friends = ['John','Tom','Mary'];
const link = "http://abc.com";
function App(){
  return (
    <div className="App">
      <h1>Hello {name}</h1>
      <p>You are {age} years old</p>
      <p>Next year you will be {age + 1}</p>
      <p>friends: {friends}</p>
      <a href={link} >Link</a>
    </div>
  );
}

export default App;

```

We can create new component and nest it to App Component

```js
const Navbar = () => {
  return (
    <nav className="navebar">
      <h1>My Blog</h1>
      <div className="links">
        <a href="/">Home</a>
        <a href="/create">New Blog</a>
      </div>
    </nav>
  )
}

export default Navbar
```

```js
import './App.css';
import Navbar from './Navbar';
import Home from './Home';


function App(){
  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <Home />
      </div>
    </div>
  );
}

export default App;
```

We can define inline style by using 2 curly braces. The outter braces mean this is a javascript expression and the inner braces mean this is an object. We should change minus sign to camel case.

```js
<p style={{
        backgroudColor: 'green',
        textAlign: 'center',
        color: 'red',
        }}>line1</p>
```

Handle event. In the second button, we use an anonymous function to help us pass arguments. 

```js
const handleClick = () => {
  console.log('hello click');
}

const sayHello = (name, event) => {
  console.log('hello ' + name);
  console.log(event);
}
return (
  <div className="home">
    <h2>Home Page</h2>
    <button onClick={handleClick}>Click me</button>
    <button onClick={(event) => { sayHello('mario', event) }}>Click me</button>
  </div>
)

```

Use state

If we click the button, name do change to luigi, but the page is not going to re-render.

```js
let name = 'mario';
const handleClick = () => {
  name = 'luigi';
  console.log(name);
}
return (
  <div className="home">
    <h2>Home Page</h2>
    <p>{name}</p>
    <button onClick={handleClick}>Click me</button>
  </div>
)
```

We can use useState to make it reactive

```js
import { useState } from 'react';
const Home = () => {
  const [name, setName] = useState('mario');
  const [age, setAge] = useState(10);
  const handleClick = () => {
    setName('luigi');
    setAge(age + 2);
    console.log(name);
  }
  return (
    <div className="home">
      <h2>Home Page</h2>
      <p>{name} is {age} years old</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}
```

If we want to output a list, we can use map method to cycle through the list.

Each item must have a key property. This key property is something that react uses to keep track of each item

```js
const Home = () => {
  const [blogs, setBlogs] = useState([
    {title: 'welcome', body:'balabala...', author:'Jeff', id:1},
    {title: 'JavaScript', body:'javascript...', author:'Mary', id:2},
    {title: 'React', body:'react...', author:'Jeff', id:3}
  ]);
  return (
    <div className="home">
      {blogs.map((blog) => (
        <div className="blog-preview" key={blog.id}>
          <h2>{ blog.title }</h2>
          <p>Writen by { blog.author }</p>
        </div>
      ))}
    </div>
  );
}
```

Props

We can make list-blog component reusable and use it in other component by pass in props.

```js
const BlogList = (props) => {
  const blogs = props.blogs;
  const title = props.title;
  console.log(props);
  return (
    <div className="home">
      <h2>{ title }</h2>
      {blogs.map((blog) => (
        <div className="blog-preview" key={blog.id}>
          <h2>{ blog.title }</h2>
          <p>Writen by { blog.author }</p>
        </div>
      ))}
    </div>
  )
}

const Home = () => {
  const [blogs, setBlogs] = useState([
    {title: 'welcome', body:'balabala...', author:'Jeff', id:1},
    {title: 'JavaScript', body:'javascript...', author:'Mary', id:2},
    {title: 'React', body:'react...', author:'Jeff', id:3}
  ]);
  return (
    <div className="home">
      <BlogList blogs={blogs} title="All Blogs"/>
    </div>
  );
}
```

We can easily re-use our component
```js
<BlogList blogs={blogs} title="All Blogs"/>
<BlogList blogs={blogs.filter((blog) => blog.author === 'Mary')} title="Mary's Blog" />
```

Also, we can distruct properties from props.

```js
const BlogList = ({blogs, title}) => {
  // const blogs = props.blogs;
  // const title = props.title;
  //...
}
```

We can add a button to delete the blog by passing a function

```js
const BlogList = ({blogs, title, handleDelete}) => {
  // const blogs = props.blogs;
  // const title = props.title;
  // console.log(props);

  return (
    <div className="home">
      <h2>{ title }</h2>
      
      {blogs.map((blog) => (
        <div className="blog-preview" key={blog.id}>
          <h2>{ blog.title }</h2>
          <p>Writen by { blog.author }</p>
          <button onClick={() => handleDelete(blog.id)}>Delete blog</button>
        </div>
      ))}
    </div>
  )
}
```

Then define and pass a delete function to Bloglist component

```js
const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const handleDelete = (id) => {
    setBlogs(blogs.filter( blog => blog.id !== id));
  }
  return (
    <div className="home">
      {blogs && <BlogList blogs={blogs} title="All Blogs" handleDelete = {handleDelete} />}
    </div>
  );
}
```

If we want to run a function every render of components, we can use another hook `useEffect`

```js
import { useEffect } from 'react';

useEffect(() => {
  console.log('do something');
})
```

If we only want it run in the first render, we can pass an empty array as the second argument. Also we can add some variables in the array, when these variables change, the function will run.

```js
useEffect(() => {
  console.log('do something');
}, [])

const [name, setName] = useState('Jeff');
useEffect(() => {
  console.log('name changed');
}, [name])

```


Normally we don't hard code in javascript, instead we fetch data from server. To test this, we can create a file with json data and run a json server with the data file.

```js
{
  "blogs": [
    {
      "title": "React Blog",
      "body": "react is one of the most famous frontend framework",
      "author": "facebook",
      "id": 1
    },
    {
      "title": "Vue Blog",
      "body": "Vue is one of the most famous frontend framework too",
      "author": "You",
      "id": 2
    },
    {
      "title": "Angular Blog",
      "body": "Angular is one of the most famous frontend framework too",
      "author": "google",
      "id": 3
    }
  ]
}
```

run a json server

```
npx json-server --watch data/db.json --port 8000
```

json server endpoints:

```
/blogs  GET fetch all blogs
/blogs/{id} GET fetch a single blog
/blogs POST add a blog
/blogs/{id} DELETE delete a blog 
```

Then we can fetch and render the data to page. Because at the beginning the blogs is null, we should check if blogs is null before render the BlogList component.

```js
const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const handleDelete = (id) => {
    setBlogs(blogs.filter( blog => blog.id !== id));
  }
  useEffect(()=>{
    fetch('http://localhost:8000/blogs')
      .then(res => {
        return res.json();
      })
      .then(data => {
        setBlogs(data);
      })
  },[])

  return (
    <div className="home">
      {blogs && <BlogList blogs={blogs} title="All Blogs" handleDelete = {handleDelete} />}
    </div>
  );
}
```

We can use a isPending variable to show message while fetching data.

```js
const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const handleDelete = (id) => {
    setBlogs(blogs.filter( blog => blog.id !== id));
  }
  useEffect(()=>{
    fetch('http://localhost:8000/blogs')
      .then(res => {
        return res.json();
      })
      .then(data => {
        setBlogs(data);
        setIsPending(false);
      })
  },[])

  return (
    <div className="home">
      {isPending && <div>loding...</div>}
      {blogs && <BlogList blogs={blogs} title="All Blogs" handleDelete = {handleDelete} />}
    </div>
  );
}
```

we can use setTimeOut to test it 

```js
useEffect(() => {
    setTimeout(() => {
        fetch('http://localhost:8000/blogs')
        .then(res => {
            return res.json();
        })
        .then(data => {
            console.log(data)
            setBlogs(data);
            setIsPending(false);
        })
    }, 2000)
    
},[]);
```

We can catch the error and show error message in the page

```js
const Home = () => {

    const [blogs, setBlogs] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [errMsg, setErrMsg] = useState(null);

    useEffect(() => {
      fetch('http://localhost:8000/blogs')
      .then(res => {
        if(!res.ok) {
          throw Error('cound not fetch the data');
        }
          return res.json();
      })
      .then(data => { 
          setBlogs(data);
          setErrMsg(null);
          setIsPending(false);
      })
      .catch(err => {
        setIsPending(false);
        setErrMsg(err.message);
      })
    },[]);
    return (
      <div className="home">
        { isPending && <div> Loading... </div>}
        { errMsg && <div>{errMsg}</div> }
        {blogs && <Blog blogs={blogs} title="All Blogs" />}
      </div>
    );
}
```

We can put the code into a javascript file to make it reusable. We can pass in a url and get the data, isPending and error message.

useFetch.js
```js
import {useState, useEffect} from 'react'

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [errMsg, setErrMsg] = useState(null);

    useEffect(() => {
        fetch(url)
        .then(res => {
          if(!res.ok) {
            console.log("err")
            throw Error('cound not fetch the data');
          }
            return res.json();
        })
        .then(data => {
            console.log(data);
            setData(data);
            setErrMsg(null);
            setIsPending(false);
        })
        .catch(err => {
          setIsPending(false);
          setErrMsg(err.message);
        })
        
      },[url]);
      return {data, isPending, errMsg}
}
export default useFetch;
```

We can pass in a url to use the code.
```js
const {data: blogs, isPending, errMsg} = useFetch('http://localhost:8000/blogs');
```


Route

install route
```
npm install react-route-dom@5
```

import route

```js
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
```

A simple route example. Visite `/` we can see Navbar and Home and visite `/create` we can see Navbar and Create. If we don't add `exact` in `/` route, it matches `/create` also. When a request is made to a route, react will go from top to button to try to match.

```js
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <Switch>
          <Route exact path="/">
            <Home/>
          </Route>
          <Route path="/create">
            <Create />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
```