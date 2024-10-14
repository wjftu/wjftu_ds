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


