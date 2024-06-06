import Menu from './Menu';
import { PanelPosition } from './Panel';
import config from './config';
import { contextMenuStyle, panelStyle } from './style';
import { ContextMenuOption } from './types/ContextMenuOption';
import { MenuOption } from './types/MenuOption';
import h from './utils/h';

export interface MenuWrapper<T> {
  show(position: PanelPosition, payload?: T): void;
  hide(): void;
  destroy(): void;
}
export default class ContextMenu {
  /** store created Menu ins*/
  private storeMenus: Menu<any>[] = [];

  contextMenuOption: ContextMenuOption;
  constructor(option: ContextMenuOption = {}) {
    this.injectCss();
    this.hideMenuEventListener();
    const defaultConfig: ContextMenuOption = {
      width: config.defaultMenuWidth,
      fixMenuWhenScroll: false,
      hideMenuWhenScroll: true,
    };
    this.contextMenuOption = Object.assign(defaultConfig, option);
    if (this.contextMenuOption.hideMenuWhenScroll) {
      this.scrollListener();
    }
  }
  /**
   * create style tag (<style>)，inject css
   */
  private injectCss() {
    const titleTag = document.querySelector('head title');
    let style = document.querySelector(`#${config.cssId}`);
    if (!style) {
      // if not be injected
      style = h(`style#${config.cssId}`, {
        innerHTML: panelStyle + contextMenuStyle,
      });
      if (titleTag) {
        document.head.insertBefore(style, titleTag.nextElementSibling);
      } else {
        document.head.appendChild(style);
      }
    }
  }
  /** click and close menu listener */
  private hideMenuEventListener() {
    /* capture:true: prevent click the element that stopPropagation in click event. */
    window.addEventListener('click', this.clickEventFunc.bind(this), { capture: true });
  }
  /** */
  private clickEventFunc(this: ContextMenu, e: MouseEvent | PointerEvent) {
    this.storeMenus.forEach(menu => {
      if (!menu.el) return;
      if (menu.el.style.display === 'block') {
        /**is click inside the contextmenu */
        let isInside = false;
        let el: HTMLElement | null = { parentElement: e.target } as HTMLElement;
        // eslint-disable-next-line no-cond-assign
        while ((el = el.parentElement)) {
          if (el === menu.el) {
            isInside = true;
            break;
          }
        }
        if (!isInside) {
          menu.hide();
        }
      }
    });
  }
  /** if scroll hide all menu */
  private scrollListener() {
    window.addEventListener('scroll', () => {
      this.hideAllMenu();
    });
  }

  /**
   * create a context menu
   * @param  menuOption menu option
   * @template Payload payload type
   * @returns
   */
  create<Payload>(menuOption: MenuOption<Payload>): MenuWrapper<Payload> {
    // if not transfer width ,use default width
    if (!menuOption.width) menuOption.width = this.contextMenuOption.width;
    // if (!menuOption.zIndex) menuOption.zIndex = this.contextMenuOption.baseZIndex;
    if (this.contextMenuOption.fixMenuWhenScroll) menuOption.position = 'fixed';

    const mainMenu = new Menu(0, menuOption);
    this.storeMenus.push(mainMenu);
    if (mainMenu.el) {
      document.body.appendChild(mainMenu.el);
    }
    return {
      show: (position, payload) => this.showMenu(position, mainMenu, payload),
      hide: () => mainMenu.hide(), // use arrow func, constraint `this` pointer
      destroy: () => this.destroy(mainMenu),
    };
  }
  /**
   * create a context menu async
   *
   * call this.create when first time, and return the created menu when next time.
   * @example
   * ```
   * const menu = contextMenu.createAsync([]);
   * menu().show(e, payload);
   * ```
   * @param menuOption
   * @template Payload
   * @returns a function wrapper this.create function
   */
  createAsync<Payload>(menuOption: MenuOption<Payload>): () => MenuWrapper<Payload> {
    let menu: MenuWrapper<Payload>;
    return () => {
      return menu || (menu = this.create(menuOption));
    };
  }
  /**
   * show a menu and hide other menus.
   * @param {Menu} menu
   */
  showMenu<T>(position: PanelPosition, menu: Menu<T>, payload?: T) {
    this.hideAllMenu();
    menu.show(position, payload);
  }
  hideAllMenu() {
    this.storeMenus.forEach(menu => menu.hide());
  }
  destroy(menu: Menu<any>) {
    menu.destroy();
    this.storeMenus = this.storeMenus.filter(menuItem => menu !== menuItem);
  }
}
