# DI-simple
简易版的 依赖注入
## DI(依赖注入)的发展
- 设计模式
   
   刚开始，我们更习惯将其称之为一种设计模式，一种职责转移，一个类对外部类的依赖只需要声明在构造函数中即可，具体的依赖类的实现细节以及创建方式，不需要关心，交给这个类的使用者来负责。这种方式好像是：类对想创建它的消费者说，hey,想创建我，当然可以，但是，我还依赖 xxx, 你需要先创建它们，然后再来把它们给我。
   
   这种方式，很明显，有一定的优点，但是缺点同样不容小视，每次创建类，最为消费者，我都需要先创建它的所有依赖，假如要创建1000次呢？

- 框架级别

    慢慢发展，我们发现，可以将这种依赖统一管理，对使用者透明。由框架统一管理对象的创建，消费者只需要声明它们的依赖即可，在需要的时候，直接创建就可以了. 

## 使用方式

```js
import { Inject, Injector } from './src/index';

class A{
    title:string = '123';
}

class B{}

class C{}

class D{
    title:string = 'abc';
    constructor(@Inject('A') a, @Inject('B') b){
        this.a = a;
        this.b = b;
    }

    test() {
        console.log('assert equel 123', this.a.title);
    }
}



// 创建一个注入器
const injector = Injector.resolveAndCreate([A, B, C, D]);


const a1 = injector.get('A');
const a2 = injector.get('A');

// 两者应该是同一个对象
console.log(`output: ${ a1 == a2 }`);
``` 

更多使用，参考测试用例以及demo目录下的示例