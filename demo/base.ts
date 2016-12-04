import { Inject, Injector } from '../src/index';

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



const injector = Injector.resolveAndCreate([A, B, C, D]);


const a1 = injector.get('A');
const a2 = injector.get('A');
console.log(`output: ${ a1 == a2 }`);