# ja-contextmenu

![NPM License](https://img.shields.io/npm/l/ja-contextmenu)
![NPM Version](https://img.shields.io/npm/v/ja-contextmenu)
![NPM Type Definitions](https://img.shields.io/npm/types/ja-contextmenu)
![NPM Downloads](https://img.shields.io/npm/dw/ja-contextmenu)

Demo: npm run dev 本项目即可

基本:

![img](https://gitee.com/japlus/ja-context-menu/raw/master/md-imgs/main.png)

特殊情况: 

![img](https://gitee.com/japlus/ja-context-menu/raw/master/md-imgs/special.png)


## 简介
* 原生js右键菜单封装。也可用于onclick事件打开菜单。
* 默认样式通过js插入style标签完成，注意class命名空间。
* 仅提供最基础的样式。
* 支持 TypeScript。
* 默认 z-index = 5000;
* [Gitee](https://gitee.com/japlus/ja-context-menu)
## 用法
> npm i ja-contextmenu
```js
import ContextMenu from 'ja-contextmenu';
const contextMenu = new ContextMenu();
const menuOption = {
  item:[
    { label:'go', onclick(e, payload){...} }
  ]
};
const menu = contextMenu.create(menuOption);
window.addEventListener('contextmenu', e => { menu.show(e, payload) });

// async create menu
const menu2 = contextMenu.createAsync(menuOption);
window.addEventListener('click', e => { menu2().show(e, payload) });

```
## 注意
安装后请把package.json 中ja-contextmenu 的版本号前的"^"删除，防止npm的预料之外的自动更新。(例: "ja-contextmenu":"`^`1.3.0" => "ja-contextmenu":"1.3.0")  
精力有限，不保证小版本更新时，不改动使用方式。

## 功能更新记录
- [x] `ContextMenuOption['arrowIcon']`, `MenuItemOption['arrowIcon']`(v1.10.3)
- [x] `MenuItemOption['arrowIcon']` 自定义子菜单的箭头 (v1.10.2)
- [x] `MenuItemOption['customItem']` 支持传入函数。(v1.10.1)
- [x] 子菜单高度大于页面时，出现滚动条。 (v1.9.0)
- [x] 子菜单展示时，如果下方位置不够，则菜单底部与页面底部对齐。 (v1.9.0)
- [x] `menu.show` 可以配置菜单默认出现的位置。 (v1.8.3)
- [x] ContextMenu.createAsync 异步创建Menu (v1.7.2)
- [x] MenuItemOption.onclick 返回true 则点击不关闭menu (v1.6.0)
- [x] MenuItemOption.icon 支持 HTMLElement (v1.6.0)
- [x] MenuItemOption.show: boolean。控制MenuItem展示。 (v1.5.0)
- [x] click 外部关闭事件，capture:true。
- [x] 有子菜单的项不能点击
- [x] 支持配置class
- [x] 支持配置图表icon 
- [x] 滚动时隐藏
- [x] 使用position:fixed
- [x] title/tip 格式化
- [x] 支持传入dom，自定义菜单项
## Example
```javascript
import ContextMenu, { h } from 'ja-contextmenu'; // types.d.ts supported
// import ContextMenu from 'ja-contextmenu/src/index.ts'  
const contextMenu = new ContextMenu({
  width: 200, // default: 200
  fixMenuWhenScroll: false, // 滚动时菜单是否固定(position:fixed) default:false
  hideMenuWhenScroll: true // 滚动时是否关闭菜单，default:true
});
const menuOption = {
  items: [
    { 
      label: 'menu1', // 选项名称
      icon: './assets/images/ico.png', // icon url | HTMLElement
      class: 'customClass', // 选项自定义class, default: ''
      tip: 'tip1', // 选项右侧提示文字, default: ''
      show: true, // 是否展示, default: true
      disabled: false, // 是否禁用选项, default: false
      onclick(e, payload) {
        // payload 为调用menu.show方法传入的参数
        console.log('menu1 click', payload);
        // return true; // 点击不关闭菜单
      },
    },
    { type: '---' }, // 分割线
    { 
      // 支持选项内容根据payload变动
      label: payload => 'menu2', 
      icon: payload => 'icon href2',
      arrowIcon: payload => h('div', '>'),
      class: payload => 'class2',
      tip: payload => 'tip2',
      show: payload => true,
      disabled: payload => true
      children: {
        width: 120,// 不传则继承父菜单宽度
        items: [
          {
            label: 'sub menu1',
            onclick: (e, payload) => {
              console.log('sub menu1 click', payload)
            }
          },{
            class: 'li-class-name',
            // 自定义选项内容
            customItem: document.createElement('div')
          },{
            // 我封装了createElement的函数h
            customItem: h('div',[
              h('span', {
                // {[element.key]:value}
                textContent: 'hello', // element.textContent = 'hello'
                style:{
                  fontWeight:'bolder'.// element.style.fontWeight = 'holder'
                  cssText: 'font-size:14px;' // element.style.cssText = 'font-size:14px;'
                }, 
                className:'class-name', 
              }),
              h('span.class-name#id',' world')
            ])
          }
        ]
      }
    },
  ],
}
let menu = contextMenu.create(menuOption);

document.body.oncontextmenu = (e) => {
  let payload = 'payload data: callback when click items';
  menu.show(e, payload);
};
// or
someButton.onclick = (e) => {
  e.position = ['left','top'];
  menu.show(e);
}

// menu.hide(); // 隐藏
// menu.destroy(); // 销毁
// menu = null;
 ```
## ContextMenu constructor 构造函数
> new ContextMenu(option: `ContextMenuOption`);
### ContextMenuOption
| key: type | default | desc |
|  ---- | ---- | ---- |
| width: number | 200 | Menu width |
| fixMenuWhenScroll: boolean | false | 滚动时菜单是否固定(hideMenuWhenScroll=false) |
| hideMenuWhenScroll: boolean | true | 滚动时是否关闭菜单 |
| arrowIcon: MenuItemOption<any>['arrowIcon'] | -- | 自定义所有菜单项的右箭头 |

## ContextMenu instance method 实例方法

### create\<PayloadType\>(option: `MenuOption`): `MenuWrapper`
创建一个菜单，返回一个MenuWrapper对象   

#### MenuOption
| param: type | default | desc |
| ---- | ---- | ---- |
| width?: number| 200 | 菜单宽度，子菜单不配置，则继承父菜单宽度 |
| class?: string\|(payload)=>string | -- | Menu ul class |
| arrowIcon: MenuItemOption<Payload>['arrowIcon'] | -- | 这个子菜单的右箭头自定义（会继承父菜单的此项配置） |
| items: `MenuItemOption` | -- | 列表配置项 |

#### MenuItemOption
| param: type | default | desc |
| ---- | ---- | ---- |
| icon?: string\|HTMLElement\|(payload)=>string\|HTMLElement | -- | 图标icon url |
| arrowIcon:HTMLElement \| (payload) => HTMLElement | -- | this items's arrow right icon |
| class?: string\|(payload)=>string | -- | 菜单项li class |
| label?: string\|(payload)=>string | -- | 选项文字 |
| tip?: string\|(payload)=>string | -- | 选项右侧提示文字 |
| show?: boolean\|(payload)=>boolean |  true  | 是否展示 |
| disabled?: boolean\|(payload)=>boolean |  false  | 是否禁用 |
| type?: `MenuItemType` | -- | 取值 '---' \| 'hr' => &lt;hr&gt; 分割线 | 
| customItem?: `HTMLElement` | -- | 自定义菜单项 |
| onclick?: function(event, payload):boolean| -- | 点击事件回调,参数payload为调用showMenu时传入的参数.return true 则点击后不关闭菜单. |
| children?: `MenuOption` | -- | 子菜单配置
## MenuWrapper
```ts
const menu:MenuWrapper = contextMenu.create<Payload>(...)
```
### 1.show(pos: { x: number, y: number, position: [PanelPositionEnum, PanelPositionEnum] }, payload?: any): {position: [PanelPositionEnum, PanelPositionEnum]}
展示菜单。
* pos: `PointerEvent` | `MouseEvent` | T extends { x: number, y: number }
  - x: number 
  - y: number
  - position: [PanelPositionEnum, PanelPositionEnum] x轴和y轴展示位置
* payload: 在点击菜单的onclick回调中返回。
* 返回：实际展示位置 x,y 左边还是右边。
### 2.hide()
### 3.destroy()
### 4.calcPosition(pos: { x: number, y: number, position: [PanelPositionEnum, PanelPositionEnum] }): { x: number, y: number, position: [PanelPositionEnum, PanelPositionEnum] }
 计算菜单将要出现的位置

 
## PanelPositionEnum 
```ts
enum PanelPositionEnum {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}
```

## Typescript Demo
```ts
import ContextMenu from 'ja-contextmenu';
const contextMenu = new ContextMenu();
// 泛型 - PayloadType
const menu = contextMenu.create<number>({
  width: 100,
  items: [
    {
      label: 'label',
      onclick(e, payload:number) { // type
        console.log(payload);
      },
    },
  ],
});

menu.show({x: 100,y:100}, 1) // payload type :number
//menu.show({x: 100,y:100}, '2') // payload type error not number

```

## 关于项目
* **例子**: npm run dev。代码在`/test`目录下。
* 打包: npm run bd
* src/utils/h.ts => document.createElement()
