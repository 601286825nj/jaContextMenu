import config from './config';

export const panelStyle = () => `
  .${config.panelClass}, .${config.panelClass} * {
    box-sizing: border-box;
  }
  .${config.panelClass}{
    --border-color: #dee0e3;
    border: 1px solid var(--border-color);
    left: 0; top: 0;
    background-color: #fff;
    position: absolute;
    z-index: ${config.defZ};
  }
  .${config.panelClass}.hide{
    display: none;
  }
  .${config.panelClass}.scroll{
    overflow: auto;
    overflow: overlay;
  }
`;

export const contextMenuStyle = () => `
  .${config.wrapperClass}{
    --item-background--hover: #e8e8e9;
    --disabled-color: #777;
    --tip-color: #5f6368;
    --li-height: ${config.itemH}px;
    user-select: none;
    padding: 2px 0 2px 0px;
    margin: 0;
  }
  /*child menu*/
  .${config.wrapperClass} .${config.panelClass}{ 
    position: absolute;
  }
  
  .${config.wrapperClass} li {
    position: relative;
    padding: 0 30px 0 30px;
    list-style: none;
    height: var(--li-height);
    line-height: var(--li-height);
    font-size: 12px;
    display: flex;
    justify-content: space-between;
  }
  .${config.wrapperClass} li.divide{
    margin: ${config.divideMargin}px 1px;
    height: 1px;
    background-color: var(--border-color);
  }
  .${config.wrapperClass} li.disabled{
    color: var(--disabled-color);
    pointer-events: none;
  }
  .${config.wrapperClass} li .menu-item-icon{
    width: 16px;
    height: 16px;
    position: absolute;
    left: 7px; 
    top: calc(calc(var(--li-height) - 16px) / 2);
  }
  .${config.wrapperClass} li .menu-item-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .${config.wrapperClass} li .menu-item-tip {
    color: var(--tip-color);
  }
  .${config.wrapperClass} li:hover:not(.divide):not(.disabled),
  .${config.wrapperClass} li.${config.wrapperClass}_hover {
    background: var(--item-background--hover);
  }
  .${config.wrapperClass} li .right-arrow {
    position: absolute;
    right: 4px; top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
  }
  .${config.wrapperClass} li .right-arrow-icon {
      position: absolute;
      left:50%;top:50%;
      transform: translate(-50%,-50%);
      border-top: 4px solid transparent;
      border-right: none;
      border-bottom: 4px solid transparent;
      border-left: 4px solid;
  }
  `;
