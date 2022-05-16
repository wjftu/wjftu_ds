# 全局异常处理

可以使用 `@ControllerAdvice` 或 `@RestControllerAdvice` 处理全局异常，以免把不必要的报错信息暴露给调用方。

`@ControllerAdvice` 可以按注解，或包名，或类名来处理异常。

```java
@ControllerAdvice(annotations = RestController.class)
@ControllerAdvice("com.wjftu.controller")
@ControllerAdvice(assignableTypes={MyController.class, MyAbstractController.class})
```

`@ExceptionHandler` 表示处理指定地方异常，同时存在父类和子类时子类异常优先。`@ResponseStatus` 指定返回状态码

```java
@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
@ExceptionHandler(IndexOutOfBoundsException.class)
```


例子：

定义一个返回结果类

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseEntity<T> {

    Integer code;
    String message;
    T data;

    public ResponseEntity(Integer code, String message){
        this.code=code;
        this.message=message;
    }

    public static ResponseEntity success(){
        return new ResponseEntity(200, "success");
    }

    public static <T> ResponseEntity<T> success(T data){
        return new ResponseEntity(200, "success", data);
    }

    public static ResponseEntity error(Integer code, String message){
        return new ResponseEntity(code, message);
    }
}
```

定义两个 Controller 

```java
@RestController
@RequestMapping("v2")
public class ExceptionHandleController {

    @RequestMapping("divide/{a}/{b}")
    public ResponseEntity<Integer> divide(@PathVariable("a") int a, @PathVariable("b") int b){
        int ret = a / b;
        return ResponseEntity.success(ret);
    }

    int[] arr={3,1,4,1,5};
    @RequestMapping("number")
    public ResponseEntity<Integer> getNumber(@RequestParam Integer i){
        return ResponseEntity.success(arr[i]);
    }
}



@RestController
@RequestMapping("v1")
public class NormalController {

    @RequestMapping("divide/{a}/{b}")
    public ResponseEntity<Integer> divide(@PathVariable("a") int a, @PathVariable("b") int b){
        int ret = a / b;
        return ResponseEntity.success(ret);
    }

    int[] arr={3,1,4,1,5};
    @RequestMapping("number")
    public ResponseEntity<Integer> getNumber(@RequestParam Integer i){
        return ResponseEntity.success(arr[i]);
    }
}
```

定义一个类处理异常，使用 `@RestControllerAdvice` 注解


```java
@RestControllerAdvice(assignableTypes = {ExceptionHandleController.class})
@Slf4j
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(ArithmeticException.class)
    public ResponseEntity handleByZero(){
        return ResponseEntity.error(500, "can not divide by 0");
    }

    @ExceptionHandler(IndexOutOfBoundsException.class)
    public ResponseEntity handleIndexOutOfBound(IndexOutOfBoundsException e){
        log.error(e.getMessage());
        return ResponseEntity.error(600,"index out of bound: "+e.getMessage());
    }
}
```

比较两者差异


```json
//http://127.0.0.1:8080/v1/divide/1/0
{
    "timestamp": "2022-05-16T15:38:47.504+00:00",
    "status": 500,
    "error": "Internal Server Error",
    "trace": "java.lang.ArithmeticException: / by zero\n\tat exception.handler.controller.NormalController.divide(NormalController.java:13)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.base/java.lang.reflect.Method.invoke(Method.java:566)\n...",
    "message": "/ by zero",
    "path": "/v1/divide/1/0"
}

//http://127.0.0.1:8080/v2/divide/1/0
{
    "code": 500,
    "message": "can not divide by 0",
    "data": null
}

//http://127.0.0.1:8080/v1/number?i=9
{
    "timestamp": "2022-05-16T15:37:46.632+00:00",
    "status": 500,
    "error": "Internal Server Error",
    "trace": "java.lang.ArrayIndexOutOfBoundsException: Index 9 out of bounds for length 5\n\tat exception.handler.controller.NormalController.getNumber(NormalController.java:20)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\n\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\n\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.base/java.lang.reflect.Method.invoke(Method.java:566)\n\tat org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:205)\n...",
    "message": "Index 9 out of bounds for length 5",
    "path": "/v1/number"
}

//http://127.0.0.1:8080/v2/number?i=9
{
    "code": 600,
    "message": "index out of bound: Index 9 out of bounds for length 5",
    "data": null
}
```




