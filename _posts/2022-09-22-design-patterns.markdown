---
layout: post
title:  "设计模式"
date:   2022-02-17 11:14:00 +0800
categories: default
---
> 版权说明：文中图片均有“稀土掘金技术社区”水印，因为本人于该网站首次发布此文，原始链接为：[https://juejin.cn/post/7065511789031030820](https://juejin.cn/post/7065511789031030820)。

> 此文档处于beta阶段，非正式发布版本。

> 本文示例采用Java语言实现，请注意其他语言在部分特性上可能存在的差异。

# 设计模式七大原则
这里所说的原则，仅仅是一些软件工程的概念，并非准则。这些原则均由不同的人在其书籍或文章中提出，并不一定具有整体性、系统性，需结合实际情况选择性的使用。在常见的设计模式中，会有很多违反这些原则的情况。
## 1. 单一职责原则(Single Responsibility Principle, SRP)
每个类都应该只有单一的功能，也即唯一的改变原因。更为通俗的说，我们需要对业务功能做合理的划分。比如在UserService中我们提供了注册和登录功能，但其中涉及的操作DB、验证码发送等细节操作的方法我们都需要放在专门的服务中并暴露给UserService调用。

职责的划分往往“不是一门技术，而是一门艺术”，是系统解耦的关键所在。

## 2. 接口隔离原则(Interface Segregation Principle, ISP)
此原则强调细化接口以获得使用上的灵活性，拒绝将多种功能方法整合到一个臃肿的接口中。类实现接口时，该接口应未提供任何冗余的方法，如果有则说明该接口应该被拆分为多个接口。

## 3. 开闭原则(Open Closed Principle, OCP)
在为一个良好设计的系统新增功能时，我们应该做到对拓展开放，对修改关闭。我们可以通过“抽象约束、封装变化”来实现这一目标。具体来说，我们可以通过抽象类或接口来定义抽象层，并将稳定不变的逻辑在抽象层固定，而可变部分则在派生类中实现。当新增需求时，我们可以直接派生一个新的实现类而无需修改既有代码。

## 4. 里氏替换原则(Liskov Substitution Principle, LSP)
将基类都替换成它的子类时，要求程序的行为没有变化。具体来说，子类可以拓展父类的功能而不能改变父类原有的功能，也即子类可以新增自己的方法，但不要重写父类的方法。此原则阐述了有关继承的一些原则，也就是什么时候适合使用继承，是对开闭原则的补充。
具体实践为：
1. 子类可以实现父类的抽象方法，但不能覆写父类的非抽象方法。
2. 子类可以增加自己特有的方法。
3. 子类重载父类方法时，方法的传入参数不能比父类严格。如父类传入List，子类则不能传入ArrayList（ArrayList实现了List接口）。
4. 子类实现父类方法时，返回类型不能比父类宽松。如父类返回ArrayList，子类则不能返回List。

违反此原则的典型例子是：正方形(Square)继承长方形(Rectangle)。

因为正方形势必会重载长方形的setLength和setWidth方法（无论是设置长还是宽，都需要同时修改长和宽以满足二者相等的要求），造成***将长方形（基类）都替换成正方形（子类），程序的行为发生了变化***。

``` Java
// 替换前
Rectangle shape = new Rectangle();
shape.setLength(100);
shape.setWidth(50);
System.out.printf(shape.area());   // 5000
// 替换后
Square shape = new Square();
shape.setLength(100);
shape.setWidth(50); // 势必会同时设置widht与length
System.out.printf(shape.area());   // 2500
```

此时可以依据合成复用原则，在Square中添加一个类型为Rectangle的成员变量并取消二者的继承关系，同时核心功能依然通过调用Rectangle的方法实现，但不再提供setWidth方法，在setLength时，同时调用Rectangle的setWidth和setLength方法。

## 5. 依赖倒转(倒置)原则(Dependence Inversion Principle, DIP)
高层模块不应该依赖低层模块，两者都应该依赖其抽象；抽象不应该依赖细节，细节应该依赖抽象。

也即我们应该面向接口或抽象编程，不要面向具体实现。如在UserService中，我们需要发送短信验证码，但短信服务商有多个，我们在UserService中引入的应该是“SmsInterface”或“SmsAbstractService”而非"AliSmsService"，而引入的具体实现类则由外部决定并传入。

具体实践为：
1. 每个类应尽量实现了接口或继承了抽象类。
2. 引用对象时应尽量引用其接口或基类。
3. 任何类都不应该从具体类派生。
4. 使用继承时尽量遵循里氏替换原则。

## 6. 迪米特法则(Law of Demeter, LoD)

组合（合成）关系：是一种***强的拥有***关系，如树根与大树的关系，树根与其他部分组成了大树，并且大树一定有树根。

聚合关系：是一种***弱的拥有***关系，如大树与花园的关系，大树可以与其他花花草草组成花园，但花园并不是一定要有大树。

又称最少知识原则（Least Knowledge Principle, LKP)，简单的说，就是仅调用与当前对象有**关联**、聚合或组合关系的对象中的方法。而对于其他对象，可通过第三方转发调用。

## 7. 合成复用原则(Composite Reuse Principle, CRP)
又称组合/聚合复用原则(Composition/Aggregate Reuse Principle, CARP)，

此原则强调尽量使用合成（组合）或聚合来达到复用的目的。满足里氏替换原则时可使用继承，其他情况则选择合成或聚合。

通过继承实现复用时，父类的内部细节通常对于子类来说是可见的，故又称为“白盒复用”。通过合成或聚合实现复用时，无法看到目标类的内部细节，故又称为“黑盒复用”。

> “审慎地组合使用对象组合与类继承，优于单独使用其中任何一种。”
>
> 摘录来自: 马丁·福勒(Martin Fowler). “重构：改善既有代码的设计（第2版）

# 说明
## UML类图样例
![5-200Z1142Qb13-2.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5865365e395f45ddb547e6a803a0a5b5~tplv-k3u1fbpfcp-watermark.image?)

# 创建型模式(Creational Patterns)
## 简单工厂模式(Simple factory)
### 场景描述
我们需要根据用户选择的运输方式，如"road"、"sea"、"air"，实例化Ship, Plane, Truck三种交通工具的一种并返回。

### 思路
1. 我们可以将这个函数放在任意服务类中，但这类函数往往被多处调用，所以考虑写在工具类。故实现如下：
``` Java
public class Utils {
    public static Transport createTransport(String transport) {
        switch (transport) {
            case "road":
                return new Truck();
            case "seas":
                return new Ship();
            case "air":
                return new Plane();
            default:
                throw new Exception("Unknown transport");
        }
    }
}
```

### 模式
这个工具类你可以称为工厂类，也就是专门用来生产实例的工厂，同时为了让大家知道这个类是工厂类，将Utils类名改为TransportFactory。
### 变体
有时候我们会像这样创建对象：
``` Java
public class Factory {
    public static Transport createTruck() {
        return new YellowTruck();
    }
    public static Transport createShip() {
        return new Ship()
    }
    public static Transport createPlane() {
        return new Plane()
    }
}
```
这也是***简单工厂模式***，它似乎毫无意义，但从代码结构上看，却有如下好处：
1. 我们可以根据情况返回其他的Truck类或代理类，比如YellowTruck、ProxyTruck，或者传入参数来决定具体的实现类。
2. 函数名往往隐含着业务注解，我们可以通过修改工厂类获取实例的方法名来使业务逻辑更清晰。
3. 我们可以返回一个新实例化的对象，也可以返回一个缓存的对象以实现对象的共用。

## 抽象工厂模式(Abstract Factory)

### 场景描述
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eac47bbb5b374279b76a35db65d6f9d3~tplv-k3u1fbpfcp-watermark.image?)
现有如上图所示的继承关系，我们需要根据global.context.os获取当前平台，并在所有使用Button和Dialog的地方实例化对应平台的组件类，同时我们希望当需要适配新平台时能足够方便。

### 思路
1. 我们的获取逻辑拥有可复用性，所以使用一个类Components并为其提供getButton、getDialog函数，在需要实例化组件类的地方，调用对应方法即可。
2. getButton、getDialog函数需要根据不同平台返回不同的具体对象，一般来说可以写很多的if...else...语句进行判断并返回正确的对象。
3. 然而每个函数中都写同一段if...else...显然是不明智的，基于面向对象的思想，我们可以使用继承，故使用如下继承体系。
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d8a0ed87268b4b7cb85d93be5ef09ae3~tplv-k3u1fbpfcp-watermark.image?)
4. 最后我们只需要维护一个AbstractComponents类型的components，并在系统初始化时通过读取global.context.os的值根据此值具体决定实例化IOSComponents, AndroidComponents或WindowsComponents并赋值给变量components。

### 模式
整个实现的抽象化表达为：
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/894be1b40104449d93a184226a213533~tplv-k3u1fbpfcp-watermark.image?)

我们称之为抽象工厂模式。你甚至可以将这个模式称为“抽象工厂类模式”，以与“工厂模式”（也即“工厂类模式”）相关联。二者的区别就是“抽象工厂模式”将工厂类也引入了继承体系，用不同子类来返回不同的实例化对象。

## 工厂方法模式(Factory Method)
### 场景描述
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3b956e7f5a3c482e908b83c29841c251~tplv-k3u1fbpfcp-watermark.image?)
现需要实现一个Game类进行游戏的渲染和控制，它引用了GameLogic用于控制游戏逻辑，如何才能快速的拓展Game让我们无需每次生成简单游戏时均需要进行如下操作：
``` Java
Game simpleGame = new Game();
SimpleGameLogic simpleLogic = new SimpleGameLogic();
simpleGame.setLogic(simpleLogic)
```

### 思路
1. 我们可以从Game类派生出SimpleGame、MediumGame、DifficultGame，并重写Game中的getGameLogic()方法，分别返回一个SimpleGameLogic、MediumGameLogic、DifficultGameLogic的实例对象。
``` Java
public abstract class Game {
    public void start() {
        GameLogic gameLogic = getGameLogic();
        gameLogic.init();
        ...
    }

    public abstract GameLogic getGameLogic();
}

public class SimpleGame extends Game {
    @Override
    public GameLogic getGameLogic() {
        return SimpleGameLogic();
    }
}

public class MediumGame extends Game {
    @Override
    public GameLogic getGameLogic() {
        return MediumGameLogic();
    }
}

public class DifficultGame extends Game {
    @Override
    public GameLogic getGameLogic() {
        return DifficultGameLogic();
    }
}
```
2. 当我们需要初始化简单游戏时，仅需：
``` Java
Game simpleGame = new SimpleGame();
```
3. 这样做的好处是当你需要将简单游戏的逻辑从SimpleGameLogic改成RobotGameLogic时，不需要修改每个初始化Game的地方而仅仅需要修改SimpleGame重写的getGameLogic方法。

### 模式
整个实现的抽象化表达为：
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/afc324d243974e6d984d8e2d7c6bfe13~tplv-k3u1fbpfcp-watermark.image?)

你可以称之为***工厂方法模式***，父类定义一个创建对象的方法而让子类决定具体实例化哪个类。

***简单工厂模式***和***抽象工厂模式***定义的是一个工厂类，整个类存在的初衷就是用于生产不同的实例，**工厂**二字用于描述整个类。而工厂方法仅仅是业务逻辑中的某个（或某几个）方法是用于在不同派生类中生产不同的实例，**工厂**二字仅仅用于描述类中创建实例相关的部分方法。

### 混淆
如有以下类：
``` Java
public class Game {
    public int year;
    public int month;
    public int day;
    
    public void start() {
        Date date = getDate();
        ...
    }

    public Date getDate(int year, int month, int day) {
        Date result = new Date();
        result.year = year;
        result.month = month;
        result.day = day;
        return result;
    }
}
```
***getDate方法***并非***工厂方法***，而仅能称为***构建方法***。因为它并未使用继承机制来让派生类决定需要实例化的类。

实际使用中，我们也可能会把***getDate方法***设置成静态方法，有人会称这种模式为***静态方法模式***，但由于上述原因，它只能被称为***静态构建方法***。

## 建造者模式(Builder)
### 场景描述
我们有一个宇宙飞船销售网站，有基础款、中级款、高级款可供选择，三者的功能依次变多。同时提供了复古风格、现代风格、像素风格，也即一共有9种不同的组合方式。除此之外，我们还需要初始化一串文本用于描述这款车，比如在为飞船添加全景天窗时，在此文本中添加“全景天窗”的描述信息。描述文本有可能被单独获取而无需初始化飞船对象。已知Spacecraft类的初始化过程较为复杂（需要初始化框架、发动机等部件），同时我们完全有可能增加更多的款型和风格，新增款型时也需要能够生成对应的描述信息.我们应该如何组织代码以实例化Spacecraft对象和String类型的描述信息？

### 思路
1. 我们实例化Spacecraft时，每为其添加一个属性，需要也在文本描述中添加对应的功能描述，二者的构建过程似乎是完全一样的。
2. 我们尝试用一个抽象的Builder概念作为它们的接口，来描述整个构建过程的步骤。
``` Java
public interface SpacecraftBuilder {
    public void createEngine();

    public void createCruiseControl();

    public void createPanoramicRoof();
    
    ...
}
```
3. 基础款、中级款的差别在于建造所调用的步骤数量不同，比如初级款就不调用createPanoramicRoof方法。所以上述接口的实现类应当是复古风格、现代风格等的构建者和描述构建者。
``` Java
public class DescBuilder implements SpacecraftBuilder {
    StringBuilder desc = new StringBuilder();

    @Override
    public void createEngine() { }

    @Override
    public void createCruiseControl() {
        desc.append("定速巡航 ");
    }

    @Override
    public void createPanoramicRoof() {
        desc.append("全景天窗 ");
    }
        
    ...
    
    public String getDesc() {
        return this.desc.toString();
    }
}

public class RetroStyleBuilder implements SpacecraftBuilder {
    Spacecraft spacecraft = new Spacecraft();

    @Override
    public void createEngine() {
        spacecraft.setEngine(new SteamEngine());
    }

    @Override
    public void createCruiseControl() {
        spacecraft.setCruiseControl(new CruiseControl());
        spacecraft.setRadar(new Radar());
    }

    @Override
    public void createPanoramicRoof() {
        spacecraft.setPanoramicRoof(new FlowerBenedPanoramicRoof());
    }
    
    ...
    
    public Spacecraft getSpacecraft() {
        return this.spacecraft;
    }
}
```
4. 我们已经具备了所有建造全部款型需要的功能。最后需要做的是为不同的款型和描述文档组装对应的部件。我们新增一个类来管理整个构建流程。
``` Java
public class Director {
    private SpacecraftBuilder builder;

    public Director(SpacecraftBuilder builder) {
        this.builder = builder;
    }

    public void buildBaseModel() {
        this.builder.createEngine();
    }

    public void buildIntermediateModel() {
        this.builder.createEngine();
        this.builder.createCruiseControl();
    }

    public void buildAdvancedModel() {
        this.builder.createEngine();
        this.builder.createCruiseControl();
        this.builder.createPanoramicRoof();
    }
}

public static void main(String[] args) {
    RetroStyleBuilder builder = new RetroStyleBuilder();
    new Director(builder).buildAdvancedModel();
    Spacecraft spacecraft = builder.getSpacecraft();

    DescBuilder descBuilder = new DescBuilder();
    new Director(builder).buildAdvancedModel();
    String desc = descBuilder.getDesc(); // 定速巡航 全景天窗 
}
```
5. 当我们需要新增风格时或者HTML格式的描述信息时，新增Builder的实现类即可。当我们需要新增车型时，在Director中新增create方法并调用需要组装的功能即可。

### 模式
我们将它称为***建造者模式***。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dd60aafb78784874a55fcd216e3d3666~tplv-k3u1fbpfcp-watermark.image?)

其关联于***模版模式***。

### 问题
1. 我们为什么不将Director中的方法直接放入Builder这个父类中而要新增一个类来统筹组装过程？
2. 与链式调用到底是何关系？

### 混淆
如果没有组装**描述文本**的需求，我们完全可以将不同风格纳入抽象工厂模式管理，由子类返回对应风格所使用的引擎、天窗等信息。使用如下：
``` Java
public class SpacecraftBuilder {
    Spacecraft spacecraft = new Spacecraft();
    // 抽象工厂
    UnitFactory unitFactory;

    public RetroStyleBuilder2(UnitFactory unitFactory) {
        this.unitFactory = unitFactory;
    }

    public void createEngine() {
        spacecraft.setEngine(unitFactory.getEngine());
    }

    public void createCruiseControl() {
        spacecraft.setCruiseControl(unitFactory.getCruiseControl());
        spacecraft.setRadar(unitFactory.getRadar());
    }

    public void createPanoramicRoof() {
        spacecraft.setPanoramicRoof(unitFactory.getPanoramicRoof());
    }

    public Spacecraft getSpacecraft() {
        return spacecraft;
    }
}
```
Builder将不再被纳入继承体系。但这样做的前提是不同风格间的各组件拼凑过程几乎相同，比如如果在为复古风添加全景天窗时，还需要为前挡风玻璃添加花边而其他风格则不用。这样的细微差别在少的情况下倒还能忍受，但一旦数量多了就会使代码陷入混乱，也即需要使用***建造者模式***。

抽象工厂模式往往用于直接创建***一个继承体系下***的某个具体对象并即刻返回，更像是在生产一系列相关对象。而我们以上使用中却在组合对象，即我们在一步步实例化各种组件并添加到飞船中以组装一个复杂对象，并且我们更关心整个对象的拼凑过程。

## 原型模式(Prototype)
### 场景描述
现有一个对象，里面存储了用户传上来的请求体信息，我们将用该对象并行的发送给用户服务和日志服务，但我们不希望用户服务对该对象的更改影响到日志服务对整个原始请求体的保存，也即我们想要复制这个对象。

### 思路
1. Java用户，只需要实现Clonale接口并实现clone方法即可快速完整浅拷贝工作。
``` Java
public class CanBeCloneable implements Cloneable {
    private String username;
    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```
2. 如果是深拷贝，我们需要在实现clone时，递归调用对象***引用数据类型的属性***的clone方法并赋值给super.clone()的返回值。

### 模式
这就是原型模式，我们为一个类实现克隆接口并提供clone方法，以使该类的实例可以被克隆出多个一样的对象。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd176c9ca4524a2ab1868bda6164942b~tplv-k3u1fbpfcp-watermark.image?)

## 单例模式(Singleton)
### 场景表述
现有一个Property类，当其实例化时会读取配置文件并为自身的属性赋值。我们不想要每次获取配置时，都实例化该类，因为这会不停的读取配置文件，而这是十分缓慢的。

### 思路
1. 全局维护一个该类的实例，每次获取Property类时都返回同一个实例。所以我们的实现如下：
``` Java
public class Property {
    private static Property instance = null;
    private final String applicationName;

    // 构造函数为私有的，外部无法直接new Property，以保证单例
    private Property() {
        this.applicationName = "READ FROM CONFIG FILE";
    }

    static Property getInstance() {
        if (instance == null) {
            instance = new Property();
        }
        return instance;
    }
}
```
2. 在多线程环境中，getInstance方法需要做同步处理，常规方法是使用[双重检查锁](https://zh.wikipedia.org/wiki/双重检查锁定模式)机制以兼顾性能与正确性。
```
public class Property {
    // 实例化过程中需要阻止重排序，故必须将属性设置为volatile。
    private volatile static Property instance = null;
    private final String applicationName;

    // 构造函数为私有的，外部无法直接new Property，以保证单例
    private Property() {
        this.applicationName = "READ FROM CONFIG FILE";
    }

    static Property getInstance() {
        if (instance != null) return instance;
        synchronized (Property.class) {
            if (instance != null) return instance;
            instance = new Property();
            return instance;
        }
    }

    public String getApplicationName() {
        return applicationName;
    }
}
```
3. Java的静态变量其实自带了延迟加载功能，如下并不会在系统初始化时实例化ApplicationInfo而会延迟到调用Property的方法时才初始化。
``` Java
public class ApplicationInfo {
    private String name;

    public ApplicationInfo() {
        System.out.println("ApplicationInfo Constructor");
        this.name = "NAME OF APPLICATION";
    }

    public String getName() {
        return name;
    }
}

public class Property {
    private static ApplicationInfo applicationInfo = new ApplicationInfo();

    public static void hello() {
        System.out.println("Hello");
    }

    public static ApplicationInfo getApplicationInfo() {
        return applicationInfo;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("Main");
        Property.hello();
        Property.getApplicationInfo().getName();
    }
}
/**
 * 输出：
 * Main
 * ApplicationInfo Constructor
 * Hello
 */
```
### 模式
至此，我们就认识了单例模式。
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f39fde95c8a4a67bf1f7fe582beb024~tplv-k3u1fbpfcp-watermark.image?)

# 结构型模式(Structural Patterns)
## 适配器模式(Adapter)
### 场景描述
你有一份老配置文件以及读取这份配置的OldProperty类，你还有一份新配置以及读取这份配置的NewProperty类。已知新老配置大多是改了配置的字段名以及配置格式，如何才能在系统过度阶段，让OldProperty也能像NewProperty一样被新系统使用？

### 思路
1. 创建一个中间类，实现NewProperty的接口并使用OldProperty类提供具体数据。
``` Java
public class OldProperty implements OldPropertyInterface {
    private String applicationName;

    @Override
    public String getApplicationName() {
        return applicationName;
    }
}

public class NewProperty implements NewPropertyInterface {
    private ApplicationInfo applicationInfo;

    @Override
    public String getName() {
        return applicationInfo.getName();
    }
}

public class PropertyAdapter implements NewPropertyInterface  {
    private OldProperty adaptee;

    public PropertyAdapter(OldProperty adaptee) {
        this.adaptee = adaptee;
    }

    @Override
    public String getName() {
        return adaptee.getApplicationName();
    }
}

```
### 模式
这个中间类及称为适配器，而这种解决方案称为适配器模式。其为两个不兼容的接口提供了兼容的访问方式。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62a34ab745d54d05936c36f3a8686bc3~tplv-k3u1fbpfcp-watermark.image?)

## 桥接模式(Bridge)
### 场景描述
你有一个User类，它可以保存数据到Mysql中，也可以保存数据到PostgreSQL中。它可以使用阿里云服务发送短信，也可以通过腾讯云服务发送短信。

### 思路
1. 我们不可能创建“MysqlUser”或者“AliUser”甚至于“AliMysqlUser”，似乎更应该参考***合成复用原则***来组合各个类。
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e62deed8e94741bd84908c5b17eec666~tplv-k3u1fbpfcp-watermark.image?)

### 模式
此模式强调将一个类或一系列紧密相连的类分为抽象和实现两个部分。抽象部分主要完成业务的抽象操作，比如save、send操作，而实现部分则进行具体的实现并提供给抽象部分调用，比如将save的数据保存到MySQL。
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30357a8bc701479f8debc3db77d8c4a5~tplv-k3u1fbpfcp-watermark.image?)

## 享元模式(Flyweight)
### 场景描述
现有一个活动信息类Activity，里面除了活动名称、开始时间、结束时间等***静态信息***外，还包含用户信息等***动态信息***，因为当调用getRewards方法获取活动奖品信息时需要根据个人信息计算具体数值，也就是说每个用户针对每一个活动都需要专门实例化一个活动对象。已知除个人信息外的其他信息占用了该类总存储大小的99.99%，请问该如何优化内存。

### 思路
1. 静态信息就让它静下来吧，既然它不可变，就用***单例模式***管理起来，全局就只有一份且不可更改。
2. 多个活动间的单例我们需要根据活动名称进行缓存，所以可配合***简单工厂模式***或***静态的工厂方法***使用。
3. 内部不再维护个人信息字段，该字段在调用getRewards时由外部传入，这样此类就仅包含静态信息了。
4. 如有需要，可以新建一个类存储个人信息，并引用共享的Activity单例对象。

### 模式
我们常认为对象包含***内部状态***和***外部状态***，二者分别与上述的***静态信息***和***动态信息***相对应。

当内部状态的存储用量远远高于外部状态，或者某一个类需要大量被创建时，可以考虑提取内部状态并为具有相同内部状态的实例提供单例、共享访问的方式。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6ca7cc2315994086a650451b51d8948c~tplv-k3u1fbpfcp-watermark.image?)

这就是享元模式，在Java中，基础数据类型的封装类也采用了享元模式进行优化，如常量池的使用。
```
public class Main {
    public static void main(String[] args) {
        String s1 = new String("HI, WHAT'S UP");    // 手动实例化时将不参与共享
        String s2 = "HI, WHAT'S UP";
        String s3 = "HI, WHAT'S UP";
        System.out.println(s1 == s2);   // false
        System.out.println(s2 == s3);   // true
        Integer i1 = new Integer(127);   // 手动实例化时将不参与共享
        Integer i2 = 127;    // 参与共享
        Integer i3 = Integer.valueOf("127");   // 参与共享
        System.out.println(i1 == i2);   // false
        System.out.println(i2 == i3);   // true
        Integer i4 = 128;   // Integer 仅缓存-128～127范围的数字
        Integer i5 = Integer.valueOf(128);
        System.out.println(i4 == i5);    // false
    }
}
```
## 外观模式(Facede)
### 模式
为复杂的系统提供一个简单、统一的接口供上层使用，令上层无需与其复杂的系统内部进行交互。 

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df4cc9d3fa5e4adcb9e528490ccce4c1~tplv-k3u1fbpfcp-watermark.image?)

## 组合模式(Composite)
### 场景描述
现有一种商品礼包，其可能包含一些具体商品和另一个商品礼包。请设计数据结构并提供计算所有具体总价值的方法。

### 思路
1. 首先，商品礼包其实也可以理解为一个商品拥有其价值。所以设计以下继承体系。
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0aa92e0980e4342a245a94ee32c78dc~tplv-k3u1fbpfcp-watermark.image?)
2. GoodPack的getPrice方法中将调用children中的所有对象的getPrice方法并计算求和返回。

### 模式
这种将对象组装成树形结构并且可以如同普通对象一样使用组合对象的模式被称为组合模式。

同时，我们也可以将非叶子结点所特有的属性和方法（如children属性，addChild方法）也加入到父类（或接口）中，但这样树形结构将不再透明，上层也需知晓树形结构的存在。在实际中使用中需根据情况灵活使用。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7d89f54dc12f464687ff1a0d5db92838~tplv-k3u1fbpfcp-watermark.image?)

## 装饰模式(Decorator)
### 场景描述
我们现在拥有一个类Shop及其实现的接口，它提供了获取商品于购买商品的功能。但VIP用户需要返回一个特别的Shop，它的商品将更多。需求还不止于此，对于老用户，我们需要增加商品数量并降低价格，对于经常从未付费的用户需要降低商品数量并降低价格。而一个用户完全可能是从未付费的老的VIP用户。

### 思路
1. 我们现为从未付费、VIP、老用户三类创建子类，并复写相应方法进行数据的增减。
2. 现在我们的问题变成了如何为满足以上两个或者三个条件的用户组装一个Shop出来。这时我们可以考虑组合的方式连接多个类。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/679d10ce84da4dc5aa9c01f4fea62292~tplv-k3u1fbpfcp-watermark.image?)
3. Decorator的派生类则调用shop的getGoodPrice和getGoodValue方法来获取经过层层处理后的结果并进一步进行处理。
``` Java
public class Shop implements ShopInterface {
    public int getGoodValue() {
        return 100;
    }

    public int getGoodPrice() {
        return 100;
    }

    public void purchase() {
        System.out.println(String.format("COST: %d", this.getGoodPrice()));
        System.out.printf(String.format("GAIN: %d", this.getGoodValue()));
    }
}

public abstract class ShopDecorator implements ShopInterface {
    protected ShopInterface shop;

    public ShopDecorator() {
    }

    public ShopDecorator(ShopInterface shop) {
        this.shop = shop;
    }

    @Override
    public void purchase() {
        System.out.println(String.format("COST: %d", this.getGoodPrice()));
        System.out.printf(String.format("GAIN: %d", this.getGoodValue()));
    }
}

public class VIPShop extends ShopDecorator {
    public VIPShop(ShopInterface shop) {
        this.shop = shop;
    }

    @Override
    public int getGoodPrice() {
        return shop.getGoodPrice() + 10;
    }

    @Override
    public int getGoodValue() {
        return shop.getGoodValue();
    }
}

public class RegularVisitorShop extends ShopDecorator {
    public RegularVisitorShop(ShopInterface shop) {
        this.shop = shop;
    }

    @Override
    public int getGoodPrice() {
        return shop.getGoodValue() - 10;
    }

    @Override
    public int getGoodValue() {
        return shop.getGoodValue() + 10;
    }
}

public class NeverPayShop extends ShopDecorator {
    public NeverPayShop(ShopInterface shop) {
        this.shop = shop;
    }

    @Override
    public int getGoodPrice() {
        return shop.getGoodValue() - 10;
    }

    @Override
    public int getGoodValue() {
        return shop.getGoodValue() - 1;
    }
}

public class Main {
    public static void main(String[] args) {
        // 组装未付费的老的VIP用户商店
        ShopInterface shop = new VIPShop(new NeverPayShop(new RegularVisitorShop(new Shop())));
        shop.purchase();
        /**
         * 输出
         * COST: 110
         * GAIN: 109
         */
    }
}
```
### 模式
此模式与***组合模式***有相似之处。

在结构上，***组合模式***中，一个包装类包含多个同一继承体系下的子类，为树形结构。而在***装饰模式***中，一个装饰类仅包含一个同一继承体系下的子类，可以理解为链式结构。

在业务逻辑上，***组合模式***中叶子结点完成了大部分的实际工作，包装类只做一些统计与分发，二者是不平等的业务角色。***装饰模式***中所有结点都在完成各自特有的业务逻辑，属于在增强业务功能，互相是平等的业务角色。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a9f5279bcf1746e9a37f2ae5df51533c~tplv-k3u1fbpfcp-watermark.image?)

## 代理模式(Proxy)
### 场景描述
我们有一个MysqlDao底层类，提供了增删改查方法。我们希望为它添加打印日志的功能，即增删改查时打印操作信息。由于是底层类，你无法直接修改它。

### 思路
1. 既然无法修改，那就把它包起来。新增一个类基础MysqlDao实现的所有类和接口，然后将实际的操作委托给内部维护的MysqlDao实例，并在转发前后打上日志即可。

### 模式

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49b1af01c86941dba5dc47e7be2b1bf5~tplv-k3u1fbpfcp-watermark.image?)

我们称这个新增的类为代理类，称这种解决方案为代理模式。

它和***装饰器模式***很像，都是基于组合原则，包装一个类然后进行转发并添加一些额外的操作，

但二者的意图不同。装饰器的层层装饰是客户端可随意组合的，用于功能增强。但代理模式往往希望外部直接使用代理类，其增加的功能一般与业务无关。

它也不同于***外观模式***，外观模式需要暴露更少的接口以隐藏复杂的内部结构，而代理类与其代理对象遵循同一接口。

# 行为模式(Behavioral Design Patterns)
## 责任链模式(Chain of Responsibility)
### 场景描述
你又有一个MysqlDao底层类，提供了查数据的方法。现在你需要为它提供可选的两级缓存功能，即本地缓存、Redis缓存，任意缓存被命中时直接返回数据。按照惯例，因为它是底层类，你无法直接修改它。

### 思路
1. 好像***代理模式***也能用，但我们并不期待客户端都使用缓存功能，并且这似乎也已经涉及到具体业务修改，再者如果以后需要提供三级四级缓存则需要不断的修改代理类，这对开闭原则并不友好。
2. ***装饰器模式***是个很好的选择，一级二级缓存层层包装，且可以选择性的使用本地缓存、Redis缓存或两者都使用。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d526ef3895bb405684bbf4671778bc2f~tplv-k3u1fbpfcp-watermark.image?)
3. CacheDao的next均指向下一个处理的DAO，如果当前未发现缓存，则将请求转发给next类，直到最后到达MysqlDao。但如果发现了缓存，则不再转发直接返回。
### 模式
注意，这里我们多了一个阻断操作，也即某一个中间类发现我能处理，则不再向下传递。这一点不是***装饰器模式***的初衷，装饰器模式是用于拓展、增强行为，但核心功能还是由原始类完成或参与。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e56e6622a4d748b09a9e580d81aded9d~tplv-k3u1fbpfcp-watermark.image?)
这种模式称为职责链模式，若我们需要为HTTP请求添加“IP限制”、“请求频率限制”、“登录校验”等功能时就可以使用此模式。


## 备忘录模式(Memento)
### 场景描述
现在有象棋游戏逻辑类ChessGame和UI渲染层的ChessFrame类，你需要记录每次操作并提供无限次数的悔棋功能。

### 思路
1. 我们在每次操作时，需要记录当时的棋子布局等游戏信息。而此操作应由ChessGame进行，因为只有它知晓有哪些内部信息需要被存储。
2. 产生的游戏信息我们新增一个类Snapshot来存储。而我们希望这些快照信息的维护交由一个专门的Caretaker类维护以使ChessGame仅需提供创建快照和根据快照恢复游戏两个功能即可。
3. 当悔棋时，ChessFrame触发Caretaker的恢复功能，调用ChessGame的restore方法并传入最近的一次快照，使恢复上一次操作前的状态。

### 模式
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bfd83a9f5a40406eaa30c6cd32043098~tplv-k3u1fbpfcp-watermark.image?)

## 命令模式(Command)
### 场景描述
现在你是一个游戏开发者，界面上有很多建筑Building对象并提供了一些诸如设置外观、设置描述文本、设置倒计时等基本功能可供调用。我们希望提供多种功能（比如升级建筑、查看建筑等），调用不同功能时，会给Building设置不同的外观、描述、倒计时等，而不同的事件可能会调用相同或不同的功能。

### 思路
1. 我们完全可以在Building中添加upgrade、view等方法以提供这些功能。但我们发现这些功能都是对于基本功能的集成且很容易变更相关需求，所以考虑使用另一个类来调用Building的基本功能。
2. 我们把每一个功能都用一个单独的类来表示，以在添加或删除功能时，只需要新增或删除这些功能类即可。
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/411bad51c8354ec59fc391e78a91b2eb~tplv-k3u1fbpfcp-watermark.image?)

### 模式
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e360418021fd4fcd9589f96a3071597c~tplv-k3u1fbpfcp-watermark.image?)
如果你希望在一众零散基础功能基础上组装多样化的操作命令则可以使用***命令模式***。有撤销操作需求，我们也可以在Command中添加revert方法，以保证do与revert的逻辑被放在一起。也可以与***备忘录***模式配合使用实现历史命令的缓存。

## 状态模式(State)
### 场景描述
现在你是一个游戏开发者，界面上有很多建筑Building对象处于不同的状态（正常、修建中、拆除中等n种）。而建筑有建造、拆除、查看等功能可供调用。问题在于当建筑处于不同的状态时，可执行的操作不尽相同。比如修建中的建筑将不能执行建造、升级等操作。你会如何设计Building类使其满足以上需求？

### 思路
1. 第一反应可能会是在Building的建造、拆除、升级方法中添加状态的判断。
``` Java
public class Building {
    private String state;
    
    public void build() {
        if (!state.equals("NORMAL")) return;
        state = "BUILDING";
        System.out.println("To state: building");
    }

    public void remove() {
        if (!state.equals("NORMAL") && !state.equals("BUILDING")) return;
        state = "REMOVING";
        System.out.println("To state: removing");
    }
    
    public void display() {
        System.out.println("Building Name: Tower");
    }

    public void info() {
        if (state.equals("NORMAL")) {
            System.out.println("Building Name: Tower");
        } else if (state.equals("REMOVING")) {
            System.out.println("Removing For: 11s");
        }
    }
}
```
2. 这看起来不太整洁，整理逻辑也会很麻烦。我们可以尝试把state做成类State并把与状态相关的建筑操作转发给State，然后派生出不同的建筑状态，而该状态能执行的操作则反过来调用Building的方法进行实现，如此一来，建筑处于什么状态时可以执行哪些操作便一目了然。
3. 同时，不要忘了在执行了某些操作之后实例化新的状态类并赋值给Building的state属性。
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e6f84a873ed4dce93c1b522e133159c~tplv-k3u1fbpfcp-watermark.image?)
``` Java
public class Building {
    protected State state;

    public void build() {
        state.build();
    }

    public void remove() {
        state.remove();
    }

    public void display() {
        System.out.println("Building Name: Tower");
    }

    public void info() {
        state.info();
    }
    
    // 真正的建造逻辑
    public void doBuild() {
        System.out.println("build now");
    }
    
     // 真正的拆除逻辑
    public void doRemove() {
        System.out.println("remove now");
    }
}

public abstract class State {
    protected Building building;

    public State(Building building) {
        this.building = building;
    }

    public void build() {
        System.out.println("do nothing");
    }

    public void remove() {
        System.out.println("do nothing");
    }

    public void info() {
        System.out.println("do nothing");
    }
}

public class NormalState extends State {
    public NormalState(Building building) {
        super(building);
    }

    @Override
    public void build() {
        building.doBuild();
        System.out.println("To state: building");
        building.state = new BuildingState(building);
    }

    @Override
    public void remove() {
        building.doRemove();
        System.out.println("To state: removing");
        building.state = new RemovingState(building);
    }

    @Override
    public void info() {
        System.out.println("Building Name: Tower");
    }
}

public class BuildingState extends State {
    public BuildingState(Building building) {
        super(building);
    }

    @Override
    public void remove() {
        building.doRemove();
        System.out.println("To state: removing");
        building.state = new RemovingState(building);
    }
}

public class RemovingState extends State {
    public RemovingState(Building building) {
        super(building);
    }

    @Override
    public void info() {
        System.out.println("Removing For: 11s");
    }
}
```
### 模式
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ea62eb8248d94ea5ad584f71e62caf86~tplv-k3u1fbpfcp-watermark.image?)
在有限的状态中，我们可以使用此模式进行循环的转换并在不同的状态执行不同的操作，称为状态模式。

## 访问者模式(Visitor)
### 场景描述
你现在是一个游戏开发者，界面上有很多建筑处于不同的状态（正常、修建中、拆除中等n种）。我们有多种操作可能被触发（鼠标左键点击、鼠标右键点击、手指点击、手指双击等m种），对不同状态的建筑进行不同的操作会调用对应状态类的不同方法。如何统筹这复杂的n*m种调用关系？

### 思路
1. 首先我们会用***状态模式***来管理所有状态，也即所有的建筑状态均继承自一个父类State，建筑类中有一个State类型的属性表示该建筑的状态。
2. 这似乎可以在不同的状态类中分别添加m种函数对应不同的操作。但这有一些小问题，每当我们需要添加或删除一种操作时，都需要修改n个状态类。同时，事件的触发和房屋的**功能逻辑**在一定程度上是耦合的。
3. 那就建立m个事件类吧，并提供n个同名函数利用多态对应不同的建筑状态下触发此事件。
4. 对于C#、Groovy等支持[多分派]('https://zh.wikipedia.org/wiki/多分派')的语言，我们已经实现了***访问者模式***。
5. 对于C、Java等语言，还有一个问题可能需要到实际开发时才会发现。当我们向一个建筑触发一个状态相关的事件时，我们只能拿到一个State类型的值，而不是具体的状态子类。那我们在第二步中的通过建筑状态调用不同的函数如何实现呢？
6. 好像需要这样：
``` Java
public abstract class Event {
    public void doFor(State state) {
        if (state instanceof NormalState) {
            doFor((NormalState) state);
        } else if (state instanceof BuildingState) {
            doFor((BuildingState) state);
        }
        ...
    }

    public abstract void doFor(NormalState state);

    public abstract void doFor(BuildingState state);
    
    ...
}

public class ClickEvent extends Event {
    public void doFor(NormalState state) {
        state.build();
    }

    public void doFor(BuildingState state) {
        state.info();
    }
    
    ...
}

public class main() {
    public static void main(String[] args) {
        State state = new NormalState();
        state.accept(new ClickEvent());
    }
}
```
7. 既然父类帮我们统一做了处理，那问题也不大，但无法否认这是典型的坏味道。
8. 我们可以通过模拟[多分派]('https://zh.wikipedia.org/wiki/多分派')来优化。
9. 我们在State类中添加一个新方法accept用来接收Event并代为执行Event::doFor方法，当我们调用accept时，this引用将指向具体的状态子类，我们运行Event.doFor(this)即可实现传入具体状态子类的目标。
``` Java
public abstract class Event {
    public abstract void doFor(NormalState state);

    public abstract void doFor(BuildingState state);
}

public class ClickEvent extends Event {
    public void doFor(NormalState state) {
        state.build();
    }

    public void doFor(BuildingState state) {
        state.info();
    }
}

public class NormalState extends State {
    @Override
    public void accept(Event event) {
        event.doFor(this);
    }
}

public class BuildingState extends State {
    @Override
    public void accept(Event event) {
        event.doFor(this);
    }
}

// 状态模式中，对state的调用往往需要通过Building类转发
public class Buillding {
    private State state;
    
    public void accept(Event event) {
        state.accept(evevt);
    }
}
```
10. 通过这样的转发，我们新增或删除Event时，只需添加或删除对用的Event派生类，而无需续写或删除***instanceof***的条件判断，因为State和Building知晓了Event的存在，在一定程度上这违背***迪米特法则***，却更符合***开闭原则***。

### 模式
这就是访问者模式，Event为访问者，其访问State的方法或变量。事件与业务操作的对应关系由访问者维护，减少了被访者的复杂性。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/54208f471d0c4f67a3a6e6c7626755cf~tplv-k3u1fbpfcp-watermark.image?)

### 新需求
如果我们在此场景之下增加”撤回功能“的需求，你会如何实现？

## 迭代器模式(Iterator)
### 场景描述
你现在是一个数据挖掘工程师，你维护着数以亿计从微博、微信等挖掘而来的公共账户信息。有多个业务方希望我们提供所有的头像数据供他们使用，如需要所有男性的头像、需要所有女性头像等。你需要提供函数返回对应头像数据给业务方。注意，你仅存储了头像的地址，图片数据需要从网络上进行下载。

### 思路
1. 由于数据量巨大（数以亿计的需要下载的图片资源），我们无法简单的返回一个List。
2. 我们采用一个一个头像返回的方式，供业务方调用，也即我们自行实现迭代器。
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac53670329fb4be599db8977eec1a394~tplv-k3u1fbpfcp-watermark.image?)
``` Java
public byte[] next() {
    /**
     * select account info by invoking methods provided by socialMediae 
     * according this.lastId and this.gender
     */
    AccountInfo nextAccount = ... INVOKE ...
    byte[] avatar = ... DOWNLOAD avatar ...
    this.lastId = nextAccount.id;
    return avatar;
}
```
3. 新增的访问逻辑和迭代进度（lastId）在Iterator中维护，我们没有因为此次需求而在AccountManager中添加具体的业务操作（仅添加了迭代器入口），这符合开闭原则。

### 模式
这便是***迭代器模式***。
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f18873e311b04f13ba4e5ef8e86bdc0f~tplv-k3u1fbpfcp-watermark.image?)
使用此模式的常用场景包括：
1. 单条数据获取极为耗时，无法一次性全部获取。即：头像数据可以依次下载，无需耗费大量的时间和空间先行下载全部数据后再返回给调用者。
2. 内部的存储结构比较复杂（如树形、链式结构混合使用等），希望对外界以统一的方式进行遍历。即：我们屏蔽掉了存储的差异性，我们隐藏了数据存储于不同表（甚至于不同DB）的事实。

## 观察者模式(Observer)
### 场景
当用户登录时，需要统计昨日简报、推送天气状况、刷新每日奖励等。当VIP即将过期时，需要发送具体过期时间的推送通知、赠送购买优惠券等。如果这样的事件与对应的操作诸多、杂乱、不稳定，请问你会如何设计代码？

### 思路
1. 开发前期，事件与操作相对简单明了时，往往可以直接在登录的函数中直接调用统计、推送、刷新等相关函数。但随着二者的对应关系日趋复杂，我们需要更为灵活的设计。
2. 我们可以使用***订阅/发布机制***，业务自行向自己感兴趣的事件进行订阅，当事件发生时，事件类将调用所有订阅了此事件的方法。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a318056c3c134bdcb4c281d012dbbae7~tplv-k3u1fbpfcp-watermark.image?)
``` Java
public abstract class AbstractEvent {
    private Set<Listener> listeners = new HashSet<>();

    public void subscribe(Listener listener) {
        listeners.add(listener);
    }

    public void unsubscribe(Listener listener) {
        listeners.remove(listener);
    }

    public void on() {
        for (Listener listener : listeners) {
            listener.onEvent(this);
        }
    }
}

public class LoginEvent extends AbstractEvent {
    private long userId;

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }
}

public interface Listener<T extends AbstractEvent> {
    public void onEvent(T event);
}

public class DailyRewardsListener implements Listener<LoginEvent> {
    @Override
    public void onEvent(LoginEvent event) {
        System.out.println(String.format("user %d login success", event.getUserId()));
    }
}

public static void main(String[] args) {
    LoginEvent event = new LoginEvent();
    DailyRewardsListener listener = new DailyRewardsListener();
    event.subscribe(listener);
    event.setUserId(1000);
    event.on(); // user 1000 login success
    event.unsubscribe(listener);
    event.on(); // NO OUTPUT
}
```
### 模式


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60474ec6580c46408d502852ed05cab0~tplv-k3u1fbpfcp-watermark.image?)

### 变体

在具体实践中，可以使用一个中间类来维护监听关系、广播事件，而不在父类Event中进行，如Spring中的**ApplicationEventMulticaster**类。因为我们仅仅实例化了一次具体事件类以接受监听器注册，当并发条件下多个用户触发登录事件时，会存在并发问题。

上述场景中加入**EventManager**作为中间类时实现如下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/75987e83bf574b148fe2be70d114c497~tplv-k3u1fbpfcp-watermark.image?)

``` Java
public class EventManager {
    private static Map<Class<? extends Event>, Set<Listener>> listeners = new HashMap();

    public static <T extends Event> void subscribe(Class<T> event, Listener<T> listener) {
        Set<Listener> set = listeners.getOrDefault(event, new HashSet());
        set.add(listener);
        listeners.put(event, set);
    }

    public static <T extends Event> void unsubscribe(Class<T> event, Listener<T> listener) {
        Set<Listener> set = listeners.getOrDefault(event, Collections.emptySet());
        set.remove(listener);
    }

    public static <T extends Event> void on(T event) {
        for (Listener listener: listeners.getOrDefault(event.getClass(), Collections.emptySet())) {
            listener.onEvent(event);
        }
    }
}

public static void main(String[] args) {
    EventManager.subscribe(LoginEvent.class, new DailyRewardsListener());
    EventManager.on(new LoginEvent(1000)); // user 1000 login success
    EventManager.on(new LoginEvent(2000)); // user 2000 login success
}
```
有人将这种添加了中间类的***观察者模式***称为***订阅/发布模式***，这种做法有待商榷。

## 中介者模式(Mediator)
### 场景描述
我们现在有Mysql、Redis、Elasticsearch等多种数据库，我们有一些数据备份的需求。如当存储数据到Mysql时，需要同时存储到Redis、Elasticsearch等多达十几种DB，当存储数据到Elasticsearch时，需要同时存储到Mysql等几种DB。

### 思路
1. 我们可以在保存数据到Mysql、Redis、Elasticsearch的函数中，同时操作另外其他DB以进行同步。
2. 但DB数种类众多，如Mysql工具种将引用多达十几种DB。同时，各DB间的备份流程分布在不同的DB工具中，难以维护。
3. 考虑使用一个上帝类，管理所有DB，用某种DB存储数据时，告知上帝类，由上帝类来决定需要同时将数据备份到哪些数据库。这样即可解决以上两个问题。
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd221444bc574a58a1e36cbaa2674716~tplv-k3u1fbpfcp-watermark.image?)

### 模式
***中介者模式***主要为了解决类之间多对多的调用关系，使原本需要与所有相关类交互转变成只需与中介者交互，使出了中间类外的其他类更符合***迪米特法则***和***单一职责原则***。但它的缺点也很明显，中介者需要知晓整个功能所涉及到的所有类，极可能成为[上帝对象](https://zh.wikipedia.org/zh-hans/上帝对象)。

## 策略模式(Strategy)
### 场景描述
我们需要对一段数据进行加密/解密，而有DES、AES等多种加密方式可供选择。而加密方式存储于用户表中由用户自行决定。当用户请求一个接口时会告知加密方式，你需要解密用户上传的数据并添加部分文字后再加密返回给用户。请问你会如何实现？
### 思路
1. 我们理应提供DESTools、AESTools提供加密/解密方法。
2. 根据传入的加密方式使用不同的Tools。
``` Java
public String handle(String ciphertext, EncryptAlgorithm algorithm) {
    String text = null;
    switch (algorithm) {
        case DES:
            text = DESEncryptor.decrypt(ciphertext);
            break;
        case AES:
            text = AESEncryptor.decrypt(ciphertext);
            break;
    }
    String result = text + " by Server";
    String resultCiphertext = null;
    switch (algorithm) {
        case DES:
            resultCiphertext = DESEncryptor.encrypt(result);
            break;
        case AES:
            resultCiphertext = AESEncryptor.encrypt(result);
            break;
    }
    return resultCiphertext;
}
```
3. 这似乎难以接受，更恰当的做法是新增公共接口EncryptTools。
``` Java
public String handle(String ciphertext, EncryptAlgorithm algorithm) {
    Encryptor encryptor = null;
    switch (algorithm) {
        case DES:
            encryptor = new DESEncryptor();
            break;
        case AES:
            encryptor = new AESEncryptor();
            break;
    }
    return encryptor.encrypt(encryptor.decrypt(ciphertext) + " by Server");
}
```

### 模式
我们不知不觉中又用到了一种设计模式，即做***策略模式***。不同的加密算法即为不同的策略。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1c702c636dcc44e3b228e6b5dafafb33~tplv-k3u1fbpfcp-watermark.image?)

### 延伸
在支持枚举类的语言中，我们往往可以借助枚举来使用**策略模式**，使代码更整洁、简单。

``` Java
public enum EncryptAlgorithm {
    DES {
        @Override
        public Encryptor getEncryptor() {
            return new DESEncryptor();
        }
    },
    AES {
        @Override
        public Encryptor getEncryptor() {
            return new AESEncryptor();
        }
    };

    public abstract Encryptor getEncryptor();
}

public String handle(String ciphertext, EncryptAlgorithm algorithm) {
    Encryptor encryptor = algorithm.getEncryptor();
    return encryptor.encrypt(encryptor.decrypt(ciphertext) + " by Server");
}
```
其中***getEncryptor***方法是一个工厂方法。

## 模版方法(Template Method)
### 场景描述
我们有DESTools、AESTools等多个加密工具对应到不同的加密算法。加密/解密均包含多个步骤，如加密步骤包括压缩数据、生成密钥、加密、字节充填等。请问我们应该如何规划这些Tools类的encrypt、decrypt方法？

### 思路
1. 我们可以尝试直接在encrypt方法中按顺序书写所有的加密步骤。
2. 但我们发现，无论何种加密算法，其步骤及顺序均是相同的，直至具体实现不同，甚至压缩数据等操作的具体实现也是一样的。
3. 我们尝试在公共父类Encryptor中，为各步骤分别添加一个抽象方法供子类实现，同时添加一个***模版方法***并顺序的调用这些抽象方法。对于所有算法实现上均相同的部分步骤，我们可以不作为抽象方法而提供公共的实现。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6624cff0bed04758a65cb88018b649d1~tplv-k3u1fbpfcp-watermark.image?)

### 模式
encrypt、decrypt方法即成为***模版方法***。我们称这种将公共流程放入***模版方法***，具体每个步骤在派生类中实现的模式称为***模版方法模式***。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6203542a5cf4610ba835161754d0a7e~tplv-k3u1fbpfcp-watermark.image?)

## 解释器模式(Interpreter)
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f982ca4d685472bb5e0f4e8e5faacde~tplv-k3u1fbpfcp-watermark.image?)


# 总结

![5-201123151944949.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba292f5bd39c4f2d999190bb6feae886~tplv-k3u1fbpfcp-watermark.image?)

