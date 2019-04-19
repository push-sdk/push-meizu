const axios = require('axios');
const querystring = require('querystring');
const crypto = require('crypto');
const _ = require('lodash');

class Meizu {
  constructor(options = {}) {
    options.pushUrl = options.pushUrl || 'https://server-api-push.meizu.com/garcia/api/server/push/varnished/pushByPushId';
    options.maxLength = 1000;
    this.options = options;
  }

  static sign(params, secret) {
    const keys = Object.keys(params).sort();
    const list = keys.map(key => `${key}=${params[key]}`);
    return Meizu.md5(list.join('') + secret);
  }

  static md5(data) {
    return crypto.createHash('md5').update(data, 'utf8').digest('hex');
  }

  push(data) {
    let { messageJson } = data;

    messageJson = _.merge({
      noticeBarInfo: {
        noticeBarType: 0,
        title: data.title,
        content: data.content
      }
    }, messageJson);

    const pushIds = [];
    while (data.list.length > 0) {
      pushIds.push(data.list.splice(0, this.options.maxLength));
    }
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
      }).then(data.success).catch(data.error);
    }

  }

}

module.exports = Meizu;