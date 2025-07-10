import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios, { delayResponse: 1000 });

mock.onPost('/upload').reply(200, {
  code: 200,
  message: 'success',
  data: {
    videoUrl: 'http://localhost/video.mp4',
  },
});

mock.onGet('/Chapters').reply(200, {
  code: 200,
  message: 'success',
  data: {
    // chapters: Array.from({ length: 10 }).map((_, i) => ({
    //   id: i + 1,
    //   title: `章节${i + 1}`,
    //   content: `内容${i + 1}`,
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // })),
    chapters: [
      {
        start: 0,
        title: '引言与背景介绍',
        duration: '00:19',
      },
      {
        start: 19,
        title: '前往曹操高陵',
        duration: '00:24',
      },
      {
        start: 43,
        title: '曹操高陵博物馆参观',
        duration: '00:42',
      },
      {
        start: 85,
        title: '曹操墓的考古证据',
        duration: '01:29',
      },
      {
        start: 214,
        title: '墓中文物解析',
        duration: '01:26',
      },
      {
        start: 340,
        title: '网友贡品展示',
        duration: '00:46',
      },
      {
        start: 386,
        title: '结束语',
        duration: '00:38',
      },
    ],
  },
});
