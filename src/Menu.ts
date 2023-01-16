import h from './utils/h';
import config from './config';
import MenuItem from './MenuItem';
import MenuOption from './types/MenuOption';
import Panel, { PanelPosition } from './Panel';
import { dealBastAttr } from './utils/utils';

/**
 * 第一层menu保留el，使用display控制显示隐藏
 * 第二层后的menu使用remove来控制显示隐藏
 */
export default class Menu<Payload> extends Panel {
  /** 列表元素 */
  ul: HTMLElement;
  /** 表示第几级的菜单*/
  level: number;
  /** config*/
  menuOption: MenuOption<Payload>;
  /** 列表项 */
  children: MenuItem<Payload>[] = [];
  /** 传入的参数 */
  payload: Payload;

  constructor(level: number, menuOption: MenuOption<Payload>) {
    super(menuOption);
    // if(level > 1) delete menuOption.position,baseZIndex?
    this.menuOption = menuOption;
    this.level = level;
    this.createUl();
    // this.renderMenuItem();//初始化时不渲染MenuItem
  }
  createUl() {
    this.ul = h(`ul`, {
      classList: [config.wrapperClassName, `${config.wrapperClassName}-lv${this.level}`],
      dataset: {
        lv: this.level,
      },
      // style: {
      //   zIndex: this.menuOption.zIndex + this.level,
      // },
      onclick: e => e.stopPropagation(),
      oncontextmenu: e => {
        e.stopPropagation();
        e.preventDefault();
      },
    });
    // 向panel中增加列表元素
    this.el.appendChild(this.ul);
  }
  /** 更新Menu ul属性 */
  updateMenuAttr() {
    this.ul.className = `${config.wrapperClassName} ${config.wrapperClassName}-lv${this.level} ${dealBastAttr(this.menuOption.class, this.payload)}`;
  }
  /** 生成菜单项 */
  renderMenuItem() {
    if (!Array.isArray(this.menuOption.items)) {
      return console.error('option.items is not type of array');
    }
    this.children = [];
    // remove all menuItem
    let menuItemEl: ChildNode;
    while ((menuItemEl = this.ul.lastChild)) {
      menuItemEl.remove();
    }
    for (const it of this.menuOption.items) {
      this.children.push(new MenuItem(this.level, it, this));
    }
    // 挂载li
    this.children.forEach(item => {
      this.ul.appendChild(item.el);
    });
  }
  /**
   * 展示菜单
   * @override
   */
  show(e: PanelPosition, payload?: any) {
    this.payload = payload;
    this.removeAllHover(); // 移除所有hover
    this.removeChildMenus(); // 打开的时候不会展示任何子菜单
    this.updateMenuAttr();
    this.renderMenuItem();
    super.show(e);
  }
  /**
   * 计算出现的位置
   * @override
   */
  calcPosition(e: PanelPosition) {
    let { x, y } = super.calcPosition(e);
    // add scrollX scrollY if page has scroll bar
    if (this.level === 0 && this.panelOption.position !== 'fixed') {
      x += window.scrollX;
      y += window.scrollY;
    }
    return { x, y };
  }

  /**
   * 移除所有hover
   */
  removeAllHover() {
    this.children.forEach(item => {
      item.el.classList.remove(`${config.wrapperClassName}_hover`);
    });
  }
  /**
   * 移除所有子菜单
   */
  removeChildMenus() {
    this.children.forEach(item => {
      item.childMenu?.el.remove();
    });
  }
  /**
   * 移除选项hover
   */
  removeItemHover() {
    this.children.forEach(childItem => {
      childItem.el.classList.remove(`${config.wrapperClassName}_hover`);
    });
  }
  /**
   * 关闭所有菜单
   */
  closeAllMenus() {
    const menus = document.querySelectorAll<HTMLElement>(`.${config.panelClassName}`);
    menus.forEach(menu => {
      const level = menu.dataset.lv;
      if (+level > 0) {
        menu.remove();
      } else {
        menu.style.display = 'none';
      }
    });
  }
  /** 移除 */
  destroy() {
    this.el.remove();
    this.el = null;
    this.menuOption = null;
    this.children = [];
    this.payload = null;
  }
}
