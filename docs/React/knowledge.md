## React

### **1、redux基本使用**
#### **1. 首先，需要安装 Redux 及其 React 绑定库 react-redux：**
```shell
npm install redux react-redux
```

#### **2. 创建 Redux 的 Action**
Actions 是描述发生什么的普通对象。它们通常包含一个 type 字段以及可选的 payload 数据。
```javascript
// src/redux/actions.js
export const increment = () => ({
type: 'INCREMENT'
});

export const decrement = () => ({
type: 'DECREMENT'
});
```

#### **3. 创建 Redux 的 Reducer**
Reducer 是一个纯函数，它接收当前的 state 和 action，并返回一个新的状态。它定义了当某个 Action 被触发时，如何更新状态。
```javascript
// src/redux/reducer.js
const initialState = {
  count: 0
};

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

export default counterReducer;
```

#### **4. 创建 Redux 的 Store**
Store 是应用的状态树，包含了所有应用的状态。你可以通过 createStore 函数创建 Store，并将 Reducer 传递给它。
```javascript
// src/redux/store.js
import { createStore } from 'redux';
import counterReducer from './reducer';

const store = createStore(counterReducer);

export default store;
```

#### **5. 在 React 中使用 Redux**
现在，将 Redux 的 Store 与 React 应用连接起来。通过 Provider 组件，可以将 Store 提供给整个应用。
```javascript
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
); 
```

#### **6. 创建 React 组件并连接 Redux**
现在，可以创建一个计数器组件，并使用 react-redux 提供的 useSelector 和 useDispatch Hooks 来连接 Redux 的状态和操作。
```javascript
// src/App.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './redux/actions';

function App() {
  // 从 Redux Store 中获取当前的计数值
  const count = useSelector((state) => state.count);
  
  // 获取 dispatch 函数来分发 actions
  const dispatch = useDispatch();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Redux Counter</h1>
      <p>{count}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}

export default App; 
```

#### **7. 运行应用**
到此，完整的 Redux 应用已经完成。你可以通过 npm start 启动 React 应用，并看到一个简单的计数器，可以通过点击按钮来增加或减少计数器的值。

#### **总结**
- **Action**: 用于描述状态的变化。
- **Reducer**: 接收当前状态和 Action，返回一个新的状态。
- **Store**: 保存应用的全局状态，并提供 dispatch 方法来分发 Actions。
- **Provider**: 将 Redux Store 提供给 React 应用的所有组件。
- **useSelector**: 用于从 Redux Store 中选择数据。
- **useDispatch**: 用于分发 Actions。

这个示例展示了 Redux 的基本使用方式，虽然简单，但包含了 Redux 的核心概念和用法。在实际项目中，随着应用复杂度的增加，可以根据需要添加更多的 Actions、Reducers 和中间件来扩展功能。

如果创建了多个 reducer，可以用 combineReducers 来合并一个根 reducer

### **2、redux中间件**

#### **1. 什么是 Redux 中间件**
Redux 中间件是一个函数，作用类似于 Express 或 Koa 中的中间件。它可以拦截、修改或扩展 dispatch 函数的行为，处理如异步操作、日志记录等任务。中间件位于 Action 发出和到达 Reducer 之间的这段流程中。

通常，Redux 的 Action Creator 返回的必须是一个普通对象，这个对象至少需要包含一个
type 字段来描述要执行的操作。例如：
```javascript
export const increment = () => ({
    type: 'INCREMENT'
});
```

但是在处理异步操作时，我们通常需要先发出一个请求，等待响应，然后根据响应的结果 dispatch 不同的 Action。这种情况下，普通对象不足以满足需求。Redux Thunk 中间件允许 Action Creator 返回一个函数而不是普通对象。
```javascript
export const fetchuser = (userId) = () => {
    return async (dispatch) => {
        dispatch(fetchUserRequest());
        1 / 请求开始
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/$fuserId)`)
            const user = await response.json();
            dispatch(fetchUserSuccess(user));
            1 / 请求成功
        } catch (error) {
            dispatch(fetchUserFailure(error.toString()));
            1 / 请求失败
        }
    }
}
```


#### **2. 使用 applyMiddleware 来配置中间件**
要在 Redux 中使用中间件，你需要在创建 Store 时通过 applyMiddleware 函数来配置。下面是一个使用中间件的完整示例。

示例：配置 Redux Thunk 中间件
Redux Thunk 是最常用的中间件之一，它允许你在 Action Creator 中返回一个函数而不是普通对象，这使得你可以处理异步操作。

安装 Redux Thunk
首先，安装 redux-thunk 中间件：
  ```shell
  npm install redux-thunk
  ```

配置 Redux Store 以支持中间件
接下来，你可以使用 applyMiddleware 函数将 Redux Thunk 中间件添加到 Redux Store 中。
   ```javascript
   // src/redux/store.js
   import { createStore, applyMiddleware } from 'redux';
   import thunk from 'redux-thunk';
   import rootReducer from './rootReducer';

   const store = createStore(
       rootReducer,
       applyMiddleware(thunk) // 添加中间件
   );
   
   export default store;
   ```

使用 Redux Thunk 进行异步操作
现在，你可以编写一个异步的 Action Creator。比如，一个获取用户数据的异步操作：
   ```javascript
   // src/redux/actions.js
   export const fetchUserRequest = () => ({
   type: 'FETCH_USER_REQUEST'
   });

   export const fetchUserSuccess = (user) => ({
      type: 'FETCH_USER_SUCCESS',
      payload: user
   });

   export const fetchUserFailure = (error) => ({
      type: 'FETCH_USER_FAILURE',
      payload: error
   });

   // 异步的 Action Creator
   export const fetchUser = (userId) => {
         return async (dispatch) => {
         dispatch(fetchUserRequest());
      try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
            const user = await response.json();
            dispatch(fetchUserSuccess(user));
         } catch (error) {
            dispatch(fetchUserFailure(error.toString()));
         }
      };
   };
   ```

在这个例子中，fetchUser 是一个异步的 Action Creator，它返回一个函数而不是一个普通对象。这个函数会接收 dispatch 作为参数，这使得你可以在函数内部进行异步操作，然后根据异步操作的结果分别 dispatch 不同的 Action。
在组件中使用异步操作
最后，你可以在 React 组件中通过 useDispatch 调用这个异步的 Action Creator：
   ```javascript
   // src/App.js
   import React, { useEffect } from 'react';
   import { useDispatch, useSelector } from 'react-redux';
   import { fetchUser } from './redux/actions';

    function App() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const loading = useSelector((state) => state.loading);
    const error = useSelector((state) => state.error);

    useEffect(() => {
        dispatch(fetchUser(1)); // 组件加载时获取用户数据
    }, [dispatch]);

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {user && (
                <div>
                    <h1>{user.name}</h1>
                    <p>{user.email}</p>
                </div>
            )}
        </div>
    );
    }
    
    export default App; 
   ``` 
在这个组件中，当组件挂载时，会 dispatch fetchUser 来触发异步的用户数据获取操作。

**总结**
- 中间件的作用：Redux 中间件可以扩展 dispatch 方法的功能，允许你在 Action 到达 Reducer 之前对其进行拦截和处理。
- 常见中间件：如 redux-thunk、redux-saga、redux-logger 等，用于处理异步操作、日志记录、调试等任务。
- 配置中间件：通过 applyMiddleware 将中间件添加到 Redux Store 中。
  这种模式使得 Redux 更加灵活，可以应对各种复杂的状态管理需求。


### **3、在React Hooks里实现类似生命周期效果**
***1. componentDidMount 效果***
<br />
使用 useEffect 并传递空依赖数组：
```jsx
  useEffect(() => {
  // 这里的代码会在组件挂载后执行
    console.log('Component did mount');
    
    return () => {
        // 可选的清理函数，相当于 componentWillUnmount
    };
    }, []); // 空数组表示只在挂载时运行一次
```

***2. componentDidUpdate 效果***
<br />
使用 useEffect 并指定依赖项：
```jsx
  useEffect(() => {
    // 这里的代码会在依赖项变化时执行
    console.log('Component did update');
  }, [someProp, someState]); // 指定依赖项
```

***3. componentWillUnmount 效果***
<br />
在 useEffect 的清理函数中实现：返回一个函数，在组件卸载时执行清理逻辑。
```jsx
  useEffect(() => {
    return () => {
      // 这里的代码会在组件卸载前执行
      console.log('Component will unmount');
    };
  }, []);
```

***4. shouldComponentUpdate 效果***
<br />
使用 React.memo 或 useMemo 进行性能优化：
```jsx
  const MyComponent = React.memo(function MyComponent(props) {
    // 组件内容
  }, (prevProps, nextProps) => {
    // 返回 true 表示不重新渲染，false 表示需要重新渲染
    return prevProps.someProp === nextProps.someProp;
  }); 
```