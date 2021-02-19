const express = require('express')
const request = require('request')
const app = express()
const port = 3000

// 294041480

app.get('/musiclyric', (req, res) => {
  const id = req.query.id;
  var options = {
    'method': 'POST',
    'url': 'https://u.y.qq.com/cgi-bin/musicu.fcg?_=1613638170108',
    'headers': {
      'Content-Type': 'text/plain'
    },
    body: `{"comm":{"g_tk":5381,"uin":0,"format":"json","inCharset":"utf-8","outCharset":"utf-8","notice":0,"platform":"h5","needNewCode":1},"detail":{"module":"music.pf_song_detail_svr","method":"get_song_detail","param":{"song_id":${id}}},"simsongs":{"module":"rcmusic.similarSongRadioServer","method":"get_simsongs","param":{"songid":${id}}},"gedan":{"module":"music.mb_gedan_recommend_svr","method":"get_related_gedan","param":{"sin":0,"last_id":0,"song_type":1,"song_id":${id}}},"video":{"module":"MvService.MvInfoProServer","method":"GetSongRelatedMv","param":{"songid":"${id}","songtype":1,"lastmvid":0,"num":5}}}`

  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    let json = JSON.parse(body);
    let arr = json.detail.data.info[7].content[0].value;
    res.send(arr);
  });
});

app.get('/musicdetail', (req, res) => {
  const songid = req.query.id;
  let options = {
    url: `https://i.y.qq.com/v8/playsong.html?songmid=${songid}&_qmp=2`,
    method: 'GET',
    headers: {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/88.0.4324.150',
    }
  }
  request(options, (err, response, body) => {
    if (err) throw new Error(err);
    let p = 'window.songlist = (.*?);'
    let json = JSON.parse(body.match(p)[1])[0];
    let obj = {
      id: json.songid,
      title: json.songname,
      singer: json.singername,
      pic: json.pic,
      m4aUrl: json.m4aUrl
    }
    res.format({
      'application/json': () => {
        res.send(obj);
      }
    });
  });
});

app.get('/topmusiclist', (req, res) => {
  const musicid = req.query.id;
  let options = {
    url: `https://i.y.qq.com/n2/m/share/details/toplist.html?ADTAG=myqq&from=myqq&channel=10007100&id=${musicid}`,
    method: 'GET',
    headers: {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/88.0.4324.150',
    }
  }
  request(options, (err, response, body) => {
    if (err) throw new Error(err);
    let p = 'var firstPageData = (.*?)</script>';
    let json = JSON.parse(body.match(p)[1]);
    let data = json.toplistData;
    let obj = {
      title: data.title,
      picurl: data.frontPicUrl,
      nick: data.titleDetail,
      listennum: data.listenNum,
      songnum: data.songnum,
      songlist: []
    }
    json.songInfoList.forEach(element => {
      let item = {
        id: element.mid,
        title: element.title,
        singer: element.singername
      }
      obj.songlist.push(item);
    });
    res.format({
      'application/json': () => {
        res.send(obj);
      }
    });
  })
});

app.get('/taogelist', (req, res) => {
  const musicid = req.query.id;
  let options = {
    url: `https://i.y.qq.com/n2/m/share/details/taoge.html?ADTAG=myqq&from=myqq&channel=10007100&id=${musicid}`,
    method: 'GET',
    headers: {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/88.0.4324.150',
    }
  }
  request(options, (err, response, body) => {
    if (err) throw new Error(err);
    let p = 'var firstPageData = (.*?);';
    if (body.match(p) == null) {
      p = 'var firstPageData = (.*)</script>';
    }
    let json = JSON.parse(body.match(p)[1]).taogeData;
    let obj = {
      title: json.title,
      picurl: json.picurl,
      nick: json.host_nick,
      listennum: json.listennum,
      headurl: json.headurl,
      songnum: json.songnum,
      songlist: []
    }
    json.songlist.forEach(element => {
      let singerArr = [];
      element.singer.forEach(singeritem => {
        singerArr.push(singeritem.name);
      });
      let item = {
        id: element.mid,
        title: element.title,
        singer: singerArr.join('/'),
        album: element.album.name
      }
      obj.songlist.push(item);
    });
    res.format({
      "application/json": () => {
        res.send(obj);
      }
    });
  });
});

app.get('/search', (req, res) => {
  const keywords = encodeURIComponent(req.query.name);
  let options = {
    url: `https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp?_=1613556152778&g_tk=5381&uin=&format=json&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&w=${keywords}&zhidaqu=1&catZhida=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&perpage=20&n=20&p=3&remoteplace=txt.mqq.all`,
    method: 'GET',
    headers: {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/88.0.4324.150',
      'Origin': 'https://i.y.qq.com',
      'Referer': 'https://i.y.qq.com/',
    }
  }
  request(options, (err, response, body) => {
    if (err) throw new Error(err);
    let json = JSON.parse(body);
    let arr = json.data.song.list;
    let sumArr = [];
    arr.forEach(item => {
      let obj = {
        id: item.songid,
        name: item.songname,
        singer: item.singer[0].name
      }
      sumArr.push(obj);
    });
    res.format({
      'application/json': () => {
        res.send(sumArr);
      }
    });
  });
})

app.get('/recommend', (req, res) => {
  let options = {
    url: 'https://i.y.qq.com/n2/m/index.html?tab=recommend',
    method: 'GET',
    headers: {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/88.0.4324.150'
    }
  }
  request(options, (err, response, body) => {
    if (err) throw new Error(err);
    let p = '<script>window.__INIT_DATA__=(.*?)</script>'
    res.format({
      'application/json': function () {
        let json = JSON.parse(body.match(p)[1]);
        let officialPlaylist = [];
        let ugcPlaylist = [];
        let zoneList = [];
        let hotList = [];
        let homeData = json.homeData;
        let arr = [];
        homeData.officialPlaylist.forEach(item => {
          let objitem = {
            id: item.id,
            title: item.title,
            cover: item.cover
          }
          officialPlaylist.push(objitem);
        });
        homeData.ugcPlaylist.forEach(item => {
          let objitem = {
            id: item.id,
            title: item.title,
            cover: item.cover
          }
          ugcPlaylist.push(objitem);
        });
        homeData.zoneList.forEach(item => {
          let objitem = {
            id: item.id,
            title: item.title,
            cover: item.cover
          }
          zoneList.push(objitem);
        });
        homeData.hotList.forEach(item => {
          let objitem = {
            id: item.id,
            title: item.title,
            cover: item.cover
          }
          hotList.push(objitem);
        });
        arr.push(officialPlaylist);
        arr.push(ugcPlaylist);
        arr.push(zoneList);
        arr.push(hotList);
        res.send(arr);
      }
    });
  });
})

app.get('/toplist', (req, res) => {
  let options = {
    url: 'https://i.y.qq.com/n2/m/index.html?tab=toplist',
    method: 'GET',
    headers: {
      'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/88.0.4324.150'
    }
  }
  request(options, (err, response, body) => {
    if (err) throw new Error(err);
    let p = '<script>window.__INIT_DATA__=(.*?)</script>'
    res.format({
      'application/json': function () {
        let json = JSON.parse(body.match(p)[1]);
        let arr = json.topListData.list;
        let sumArr = [];
        arr.forEach(item => {
          item.toplist.forEach(element => {
            let obj = {
              id: element.topId,
              title: element.title,
              pic: element.frontPicUrl,
              songArr: []
            }
            element.song.forEach(songitem => {
              let songObj = {
                id: songitem.songId,
                title: songitem.title,
                singel: songitem.singerName
              }
              obj.songArr.push(songObj);
            });
            sumArr.push(obj);
          });
        });
        res.json(sumArr);
      }
    });
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})