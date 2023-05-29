import { PanelOption } from '@/Panel';
import { BaseAttr } from './common';
import { MenuItemOption } from './MenuItemOption';

export type MenuOption<Payload> = PanelOption & {
  /** <ul> class */
  class?: BaseAttr<string, Payload>;
  /** menu items <li> */
  items?: MenuItemOption<Payload>[];
};
