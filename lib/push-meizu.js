const axios = require('axios');
const querystring = require('querystring');
const crypto = require('crypto');
const _ = require('lodash');

class Meizu {
  constructor(options = {}) {
    options.pushUrl = options.pushUrl || 'https://server-api-push.meizu.com/garcia/api/server/push/varnished/pushByPushId';
    options.maxLength = options.maxLength || 1000;
    this.options = options;
  }

  async sleep(time) {
    return new Promise((reslove) => {
      setTimeout(() => {
        reslove({});
      }, time);
    })
  }

  static sign(params, secret) {
    const keys = Object.keys(params).sort();
    const list = keys.map(key => `${key}=${params[key]}`);
    return Meizu.md5(list.join('') + secret);
  }

  static md5(data) {
    return crypto.createHash('md5').update(data, 'utf8').digest('hex');
  }

  async push(data) {
    let n = 0;
    let success_total = 0;
    let fail_total = 0;
    let { messageJson } = data;

    messageJson = _.merge({
      noticeBarInfo: {
        noticeBarType: 0,
        title: data.title,
        content: data.content
      }
    }, messageJson);

    const pushIds = _.chunk(data.list, this.options.maxLength);

    data.success = data.success || function () { };
    data.fail = data.fail || function () { };
    data.finish = data.finish || function () { };

    for (const i in pushIds) {
      const params = {
        appId: this.options.appId,
        pushIds: pushIds[i].join(','),
        messageJson: JSON.stringify(messageJson)
      };

      params.sign = Meizu.sign(params, this.options.appSecret);

      axios({
        url: this.options.pushUrl,
        method: 'POST',
        data: querystring.stringify(params),
      }).then(res => {
        n++;
        data.success(res);
        if (res.data.code == '200') {
          if (res.data.value[110003]) {
            fail_total += res.data.value[110003].length;
            success_total += pushIds[i].length - res.data.value[110003].length;
          } else {
            success_total += pushIds[i].length;
          }
        }
        if (n >= pushIds.length) {
          data.finish({
            status: 'success',
            maxLength: this.options.maxLength,
            group: pushIds.length,
            success_total,
            fail_total
          });
        }
      }).catch((err) => {
        n++;
        data.fail(err);
        if (n >= pushIds.length) {
          data.finish({
            status: 'success',
            maxLength: this.options.maxLength,
            group: pushIds.length,
            success_total,
            fail_total
          });
        }
      });

      await this.sleep(data.sleep);
    }

  }

}

module.exports = Meizu;