import store from 'store/store';
export const sleep = (time: number) =>
  new Promise((res) => setTimeout(res, time));

export const calculateWindowSize = (windowWidth: number) => {
  if (windowWidth >= 1200) {
    return 'lg';
  }
  if (windowWidth >= 992) {
    return 'md';
  }
  if (windowWidth >= 768) {
    return 'sm';
  }
  return 'xs';
};

export const setWindowClass = (classList: string) => {
  const window: HTMLElement | null =
    document && document.getElementById('root');
  if (window) {
    // @ts-ignore
    window.classList = classList;
  }
};
export const addWindowClass = (classList: string) => {
  // const window: HTMLElement | null =
  //   document && document.getElementById('root');
  const window: HTMLElement = document.body;
  if (window) {
    // @ts-ignore
    window.classList.add(classList);
  }
};

export const removeWindowClass = (classList: string) => {
  // const window: HTMLElement | null =
  //   document && document.getElementById('root');

  const window: HTMLElement = document.body;

  if (window) {
    // @ts-ignore
    window.classList.remove(classList);
  }
};

export const setActiveMainMenu = (key: string) => {

  if (key == undefined || key == '') return;


  document.querySelectorAll('.main-header .nav-link.active').forEach(element => {
    element.classList.remove('active');

  });

  const item = document.querySelector(`.main-header .nav-link[data-key="${key}"]`);

  if (item)
    item.classList.add('active');

};
