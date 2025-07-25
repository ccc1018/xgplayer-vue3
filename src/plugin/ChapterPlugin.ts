import { Plugin } from 'xgplayer';
import type { IPluginOptions } from 'xgplayer/es/plugin/plugin';

const { POSITIONS } = Plugin;

interface Chapter {
  title: string;
  start: number;
  duration: number;
}

export default class ChapterPlugin extends Plugin {
  private isListVisible = false;
  private listElement: HTMLElement | null = null;
  private btnElement: HTMLElement | null = null;

  static get pluginName() {
    return 'chapterPlugin';
  }

  static get defaultConfig() {
    return {
      position: POSITIONS.CONTROLS_LEFT,
      text: '章节',
      icon: '',
      // icon: '<svg t="1749716751903" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5035" width="200" height="200"><path d="M400 876.8l339.2-339.2v-44.8L400 156.8l-44.8 44.8 313.6 313.6-313.6 316.8z" fill="#707070" p-id="5036"></path></svg>',
      index: 1,
      iconStyle: {
        width: '5px',
        height: '5px',
      },
      textStyle: {
        textAlign: 'center',
        fontSize: '16px',
        color: '#fff',
      },
      chapters: [] as Chapter[], // 确保有默认值
    };
  }

  constructor(args: IPluginOptions | undefined) {
    super(args);
  }

  afterCreate() {
    this.setAttr('data-index', '3');
    this.injectStyles();
    this.initElements();
    this.initEvents();
  }

  private injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
    .xgplayer-chapter {
      display: flex;
      align-items: center;
      height: 100%;
      position: relative;
      cursor: pointer;
      padding: 0 10px;
    }
    .chapter-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 13px;
      white-space: nowrap;
      transition: all 0.3s;
    }
    .chapter-btn:hover {
      color: #00a1d6;
    }
    .chapter-icon {
      width:20px;
      height: 20px;
      display: inline-block;
      margin-right: 4px;
      transition: transform 0.3s;
    }
    .chapter-icon.active {
      transform: rotate(180deg);
    }
    .chapter-list {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(24, 24, 28, 0.92);
      border-radius: 12px;
      padding: 8px 0;
      list-style: none;
      margin: 0;
      min-width: 200px;
      max-height: 320px;
      overflow-y: auto;
      z-index: 100;
      box-shadow: 0 4px 24px rgba(0,0,0,0.25);
      border: none;
      opacity: 0;
      visibility: hidden;
      transform: translateX(-50%) translateY(10px);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .chapter-list.active {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }
    .chapter-list::-webkit-scrollbar {
      width: 6px;
    }
    .chapter-list::-webkit-scrollbar-thumb {
      background: rgba(0,161,214,0.25);
      border-radius: 3px;
    }
    .chapter-list li {
      padding: 0 18px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      white-space: nowrap;
      cursor: pointer;
      color: #fff;
      font-size: 15px;
      text-align: left;
      border: none;
      background: none;
      transition: all 0.18s;
      border-radius: 6px;
      margin: 0 6px;
      margin-bottom: 2px;
    }
    .chapter-list li:last-child {
      margin-bottom: 0;
    }
    .chapter-list li:hover {
      background: rgba(0,161,214,0.12);
      color: #00a1d6;
    }
    .chapter-list li.active {
      color: #00a1d6;
      background: rgba(0,161,214,0.18);
      font-weight: bold;
    }
    .chapter-title {
      flex: 1 1 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .chapter-time {
      color: #aaa;
      font-size: 12px;
      margin-left: 12px;
      flex-shrink: 0;
      min-width: 48px;
      text-align: right;
    }
    .chapter-list li:hover .chapter-time,
    .chapter-list li.active .chapter-time {
      color: #00a1d6;
    }
  `;
    document.head.appendChild(style);
  }

  private initElements() {
    this.btnElement = this.find('.chapter-btn');
    this.listElement = this.find('.chapter-list');

    // 插入图标
    if (this.btnElement) {
      const icon = document.createElement('div');
      icon.className = 'chapter-icon';
      icon.innerHTML = this.config.icon;
      this.btnElement.insertBefore(icon, this.btnElement.firstChild);
    }
  }

  private initEvents() {
    // 按钮点击事件
    this.btnElement?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleList();
    });

    // 列表项点击事件
    this.listElement?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const li = target.closest('li');
      if (li) {
        const start = parseFloat(li.dataset.start || '0');
        this.player.seek(start);
        this.hideList();

        // 高亮当前章节
        this.listElement?.querySelectorAll('li').forEach((item) => {
          item.classList.remove('active');
        });
        li.classList.add('active');
      }
    });

    // 点击播放器其他地方关闭列表
    this.player.on('click', () => {
      this.hideList();
    });

    // 播放时间更新时高亮对应章节
    this.player.on('timeupdate', () => {
      this.highlightCurrentChapter();
    });
  }

  private toggleList() {
    this.isListVisible = !this.isListVisible;

    if (this.listElement) {
      this.listElement.classList.toggle('active', this.isListVisible);
    }

    if (this.btnElement) {
      const icon = this.btnElement.querySelector('.chapter-icon');
      if (icon) {
        icon.classList.toggle('active', this.isListVisible);
      }
    }
  }

  private hideList() {
    this.isListVisible = false;

    if (this.listElement) {
      this.listElement.classList.remove('active');
    }

    if (this.btnElement) {
      const icon = this.btnElement.querySelector('.chapter-icon');
      if (icon) {
        icon.classList.remove('active');
      }
    }
  }

  private highlightCurrentChapter() {
    const currentTime = this.player.currentTime;
    const chapters = this.config.chapters || [];

    if (!this.listElement) return;

    let activeIndex = -1;

    this.listElement.querySelectorAll('li').forEach((item, index) => {
      const start = parseFloat(item.dataset.start || '0');
      const nextStart = index < chapters.length - 1 ? chapters[index + 1].start : Number.MAX_VALUE;

      if (currentTime >= start && currentTime < nextStart) {
        item.classList.add('active');
        activeIndex = index;
      } else {
        item.classList.remove('active');
      }
    });

    // 自动滚动到可见区域
    if (activeIndex >= 0 && this.isListVisible) {
      const activeItem = this.listElement.children[activeIndex] as HTMLElement;
      if (activeItem) {
        const listRect = this.listElement.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();

        if (itemRect.top < listRect.top) {
          this.listElement.scrollTop = activeItem.offsetTop;
        } else if (itemRect.bottom > listRect.bottom) {
          this.listElement.scrollTop = activeItem.offsetTop - (listRect.height - itemRect.height);
        }
      }
    }
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  render() {
    return `
    <xg-icon class="xgplayer-chapter">
      <div class="chapter-btn">${this.config.text}</div>
      <ul class="chapter-list">
        ${(this.config.chapters || [])
          .map(
            (ch: Chapter) => `
          <li data-start="${ch.start}">
            <span class="chapter-title">${ch.title}</span>
            <span class="chapter-time">${this.formatTime ? this.formatTime(ch.start) : ''}</span>
          </li>
        `,
          )
          .join('')}
      </ul>
    </xg-icon>
    `;
  }

  destroy() {
    // 清理事件监听
    this.player.off('click', this.hideList);
    this.player.off('timeupdate', this.highlightCurrentChapter);
    super.destroy();
  }
}
