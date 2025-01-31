import MenuItem from './MenuItem';
import Panel from './Panel';
import config from './config';
import { MenuOption } from './types/MenuOption';
import h from './utils/h';
import { dealBaseAttr } from './utils/utils';

/**
 * first layer menu keep el, use display to control show/hide
 * second layer and after menu use remove to control show/hide
 */
export default class Menu<Payload> extends Panel {
  /** menu id */
  id: string | undefined;

  ul!: HTMLElement;
  /** menu level*/
  level: number;
  /** config*/
  menuOption: MenuOption<Payload> | null;
  children: MenuItem<Payload>[] = [];
  /** menu show payload */
  payload?: Payload;

  constructor(menuOption: MenuOption<Payload>, init?: { level?: number; id?: string }) {
    super(menuOption);
    this.id = init?.id || Math.random().toString(36).slice(2, 10);
    // if(level > 1) delete menuOption.position,baseZIndex?
    this.menuOption = menuOption;
    this.level = init?.level || 0;
    this.createUl();
    // this.renderMenuItem();// called when show
  }
  createUl() {
    this.ul = h(`ul`, {
      classList: [config.wrapperClass, `${config.wrapperClass}-lv${this.level}`],
      onclick: e => e.stopPropagation(),
      oncontextmenu: e => {
        e.stopPropagation();
        e.preventDefault();
      },
    });
    this.el?.appendChild(this.ul);
  }
  updateMenuAttr() {
    if (this.el) {
      this.el.dataset.jaMenuId = this.id;
      this.el.dataset.lv = this.level.toString();
    }
    this.ul.className = `${config.wrapperClass} ${config.wrapperClass}-lv${this.level} ${dealBaseAttr(this.menuOption?.class, this.payload)}`;
  }
  renderMenuItem() {
    if (!Array.isArray(this.menuOption?.items)) {
      return console.error('option.items is not type of array');
    }
    this.children = [];
    // remove all menuItem
    let menuItemEl: ChildNode | null;
    while ((menuItemEl = this.ul.lastChild)) {
      menuItemEl.remove();
    }
    if (!this.menuOption?.items) return;

    for (const it of this.menuOption.items) {
      const menuItem = new MenuItem(this.level, it, this);
      this.children.push(menuItem);
      this.ul.appendChild(menuItem.el);
    }
  }
  /**
   * @override
   */
  show(e: Parameters<Panel['show']>[0], payload?: any) {
    this.prepareMenuShow(payload);
    return super.show(e); // calculate transform:translate
  }

  /**
   * do something before menu show
   * @param payload data
   */
  prepareMenuShow(payload: any) {
    this.payload = payload;
    this.removeAllHover();
    this.removeChildMenus(); // Not show child menu when open menu
    this.updateMenuAttr();
    this.renderMenuItem();
  }

  /**
   * menu position
   * @override
   */
  calcPosition(...p: Parameters<Panel['calcPosition']>) {
    const res = super.calcPosition(...p);
    let { x, y } = res;
    // add scrollX scrollY if page has scroll bar
    if (this.level === 0 && this.panelOption?.position !== 'fixed') {
      x += window.scrollX;
      y += window.scrollY;
    }
    return { x, y, position: res.position };
  }

  private closeMenus(lv: number, hide = true) {
    const menus = document.querySelectorAll<HTMLElement>(`.${config.panelClass}`);
    menus.forEach(menu => {
      const level = menu.dataset.lv;
      if (level && +level > lv && menu.dataset.jaMenuId === this.id) {
        menu.remove();
      } else if (hide) {
        menu.classList.add('hide');
      }
    });
  }

  removeAllHover() {
    this.children.forEach(item => {
      item.el.classList.remove(`${config.wrapperClass}_hover`);
    });
  }
  /**
   * remove all child menus
   */
  removeChildMenus() {
    this.closeMenus(this.level, false);
  }

  /**
   * remove item hover status
   */
  removeItemHover() {
    this.children.forEach(childItem => {
      childItem.el.classList.remove(`${config.wrapperClass}_hover`);
    });
  }

  closeAllMenus() {
    this.closeMenus(0, true);
  }

  /**
   * @override
   */
  hide() {
    this.closeAllMenus();
    super.hide();
  }

  destroy() {
    super.destroy();
    this.menuOption = null;
    this.children = [];
    this.payload = undefined;
  }
}
