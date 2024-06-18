---
title: Vue
sidebar_position: 5
---

Vue.js ，市场占有率前 2 的前端框架

官方文档： https://vuejs.org/
中文官方文档： https://cn.vuejs.org/ 


### 创建 Vue 项目

通过 CDN 使用 Vue

全局构建版本：所有顶层 API 都以属性的形式暴露在了全局的 Vue 对象上，可以通过解构获取这些

```html
<!Doctype html>
<html>
    <head>
        <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    </head>
    <body>
        <div id="app">
            {{ msg }}
        </div>
        <script>
            Vue.createApp({
                setup() {
                    return {
                        msg: "success"
                    }
                }
            }).mount("#app")
        </script>
    </body>
</html>
```

使用 ES 模块构建版本

```html
<!Doctype html>
<html>
    <head>

    </head>
    <body>
        <div id="app">
            {{ msg }}
        </div>
        <script type="module">
            import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
            createApp({
                setup() {
                    const msg = ref('success')
                    return {
                        msg
                    }
                }
            }).mount('#app')
        </script>
    </body>
</html>
```

每个 Vue 应用都是通过 createApp 函数创建一个新的 应用实例，传入的是一个根组件，并将其挂载到 dom 元素，可以使用 mount 方法传入 css 选择器将其挂载。

```js
import { createApp } from 'vue'

const app = createApp({
  /* 根组件选项 */
})
app.mount('#app')
```

### 基础

响应式数据 

在组合式 API 中，推荐使用 ref() 函数来声明响应式状态，ref 会返回一个带有 value 属性的引用对象，可以通过这个属性获取或修改值，当状态改变时会重新渲染

为了方便，在模版中使用不需要用 value 属性，ref 会自动解包，可以直接使用

```html
<div id="app">
    {{ count }}
    <button @click="count++">count++</button>
    <button @click="increment">increment</button>
</div>
<script type="module">
    import { createApp, ref, reactive } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
    createApp({
        setup() {
            const count = ref(1)
            const increment = () => {
                count.value++
            }
            return {
                count,
                increment
            }
        }
    }).mount('#app')
</script>
```

也可以使用 reactive 来声明响应式变量，通过代理对象实现，当状态改变时会重新渲染

reactive 适合复杂对象，不能用于基本类型 string、number 或 boolean。由于通过代理，因此不能替换整个对象

```html
<div id="app">
    {{ people }}
    <button @click="people.age++">count++</button>
    <button @click="increment">increment</button>
</div>
<script type="module">
    import { createApp, ref, reactive } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
    createApp({
        setup() {
            const people = reactive({
                name: "jeff",
                age: 1
            })
            const increment = () => {
                people.age++
            }
            return {
                people,
                increment
            }
        }
    }).mount('#app')
</script>
```

可以使用 v-on 指令 (简写为 @) 来监听事件，例如 `v-on:click` ，事件发生时会运行后面的 JavaScript 语句。

```html
<div id="app">
    {{ people }}
    <button v-on:click="increment">increment1</button>
    <button @click="increment">increment2</button>
</div>
<script type="module">
    import { createApp, ref, reactive } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
    createApp({
        setup() {
            const people = ref({
                name: "jeff",
                age: 1
            })
            const increment = () => {
                console.log(people)
                people.value.age++
            }
            return {
                people,
                increment
            }
        }
    }).mount('#app')
</script>
```

条件渲染

v-show 和 v-if 可以用来控制显示

```html
<div id="app">
    <div>show: {{ show }}</div>
    <div v-show="show">v-show</div>
    <div v-if="show">v-if</div>
    <div v-else="show">v-else</div>
    <button @click="change">Change show</button>
</div>
<script type="module">
    import { createApp, ref, reactive } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
    createApp({
        setup() {
            const show = ref(true)
            const change = () => {
                show.value = !show.value
            }
            return {
                show,
                change
            }
        }
    }).mount('#app')
</script>
```

查看源代码可以看到 v-show 是通过 display 控制的，而 v-if 是加入或移除元素，v-show 有更高的性能优势

```html
<div style="display: none;">v-show</div>
<div>v-else</div>
```

动态属性绑定 

可以使用 v-bind 或者简写冒号进行动态属性绑定

```html
<div id="app">
    <div :style="{ 'font-size': fontSize + 'px' }">Size</div>
    <input type="text" v-bind:value="fontSize">
    <input type="text" :value="fontSize">
    <button @click="fontSize++">increment</button>
</div>
<script type="module">
    import { createApp, ref, reactive } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
    createApp({
        setup() {
            const fontSize = ref(1)
            return {
                fontSize
            }
        }
    }).mount('#app')
</script>
```

列表渲染

可以使用 v-for 遍历对象和数组

可以在 template 上使用 v-for 来渲染一个包含多个元素的块，template 不会渲染

key 不是必要的，但推荐使用，以提高性能


```html
<div id="app">
    <div v-for="(value, key, index) in people" :key="key">
        value: {{value}}, key: {{key}}, index: {{index}}
    </div>
    <div v-for="(number, index) in numbers" :key="index">
        number: {{ number }} , index: {{ index }}
    </div>
    <template v-for="number in numbers" :key="index">
        <div v-if="number % 2 === 1">{{ number }}</div>
    </template>
</div>
<script type="module">
    import { createApp, ref, reactive } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
    createApp({
        setup() {
            const people = ref({
                name: "jeff",
                age: 12
            })
            const numbers = ref([11,22,33])
            return {
                people,
                numbers
            }
        }
    }).mount('#app')
</script>
```


