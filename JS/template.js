/*!
 * artTemplate - Template Engine
 * https://github.com/aui/artTemplate
 * Released under the MIT, BSD, and GPL Licenses
 */

!(function () {
  /**
     * 模板引擎
     * @name    template
     * @param   {String}            模板名
     * @param   {Object, String}    数据。如果为字符串则编译并缓存编译结果
     * @return  {String, Function}  渲染好的HTML字符串或者渲染方法
     */
  const template = function (filename, content) {
    return typeof content === 'string'
      ? compile(content, {
          filename: filename
        })
      : renderFile(filename, content)
  }

  template.version = '3.0.0'

  /**
     * 设置全局配置
     * @name    template.config
     * @param   {String}    名称
     * @param   {Any}       值
     */
  template.config = function (name, value) {
    defaults[name] = value
  }

  var defaults = template.defaults = {
    openTag: '<%', // 逻辑语法开始标签
    closeTag: '%>', // 逻辑语法结束标签
    escape: true, // 是否编码输出变量的 HTML 字符
    cache: true, // 是否开启缓存（依赖 options 的 filename 字段）
    compress: false, // 是否压缩输出
    parser: null // 自定义语法格式器 @see: template-syntax.js
  }

  const cacheStore = template.cache = {}

  /**
     * 渲染模板
     * @name    template.render
     * @param   {String}    模板
     * @param   {Object}    数据
     * @return  {String}    渲染好的字符串
     */
  template.render = function (source, options) {
    return compile(source, options)
  }

  /**
     * 渲染模板(根据模板名)
     * @name    template.render
     * @param   {String}    模板名
     * @param   {Object}    数据
     * @return  {String}    渲染好的字符串
     */
  var renderFile = template.renderFile = function (filename, data) {
    const fn = template.get(filename) || showDebugInfo({
      filename: filename,
      name: 'Render Error',
      message: 'Template not found'
    })
    return data ? fn(data) : fn
  }

  /**
     * 获取编译缓存（可由外部重写此方法）
     * @param   {String}    模板名
     * @param   {Function}  编译好的函数
     */
  template.get = function (filename) {
    let cache

    if (cacheStore[filename]) {
      // 使用内存缓存
      cache = cacheStore[filename]
    } else if (typeof document === 'object') {
      // 加载模板并编译
      const elem = document.getElementById(filename)

      if (elem) {
        const source = (elem.value || elem.innerHTML)
          .replace(/^\s*|\s*$/g, '')
        cache = compile(source, {
          filename: filename
        })
      }
    }

    return cache
  }

  var toString = function (value, type) {
    if (typeof value !== 'string') {
      type = typeof value
      if (type === 'number') {
        value += ''
      } else if (type === 'function') {
        value = toString(value.call(value))
      } else {
        value = ''
      }
    }

    return value
  }

  const escapeMap = {
    '<': '&#60;',
    '>': '&#62;',
    '"': '&#34;',
    "'": '&#39;',
    '&': '&#38;'
  }

  const escapeFn = function (s) {
    return escapeMap[s]
  }

  const escapeHTML = function (content) {
    return toString(content)
      .replace(/&(?![\w#]+;)|[<>"']/g, escapeFn)
  }

  const isArray = Array.isArray || function (obj) {
    return ({}).toString.call(obj) === '[object Array]'
  }

  const each = function (data, callback) {
    let i, len
    if (isArray(data)) {
      for (i = 0, len = data.length; i < len; i++) {
        callback.call(data, data[i], i, data)
      }
    } else {
      for (i in data) {
        callback.call(data, data[i], i)
      }
    }
  }

  const utils = template.utils = {

    $helpers: {},

    $include: renderFile,

    $string: toString,

    $escape: escapeHTML,

    $each: each

  }/**
 * 添加模板辅助方法
 * @name    template.helper
 * @param   {String}    名称
 * @param   {Function}  方法
 */
  template.helper = function (name, helper) {
    helpers[name] = helper
  }

  var helpers = template.helpers = utils.$helpers

  /**
     * 模板错误事件（可由外部重写此方法）
     * @name    template.onerror
     * @event
     */
  template.onerror = function (e) {
    let message = 'Template Error\n\n'
    for (const name in e) {
      message += '<' + name + '>\n' + e[name] + '\n\n'
    }

    if (typeof console === 'object') {
      console.error(message)
    }
  }

  // 模板调试器
  var showDebugInfo = function (e) {
    template.onerror(e)

    return function () {
      return '{Template Error}'
    }
  }

  /**
     * 编译模板
     * 2012-6-6 @TooBug: define 方法名改为 compile，与 Node Express 保持一致
     * @name    template.compile
     * @param   {String}    模板字符串
     * @param   {Object}    编译选项
     *
     *      - openTag       {String}
     *      - closeTag      {String}
     *      - filename      {String}
     *      - escape        {Boolean}
     *      - compress      {Boolean}
     *      - debug         {Boolean}
     *      - cache         {Boolean}
     *      - parser        {Function}
     *
     * @return  {Function}  渲染方法
     */
  var compile = template.compile = function (source, options) {
    // 合并默认配置
    options = options || {}
    for (const name in defaults) {
      if (options[name] === undefined) {
        options[name] = defaults[name]
      }
    }

    const filename = options.filename

    try {
      var Render = compiler(source, options)
    } catch (e) {
      e.filename = filename || 'anonymous'
      e.name = 'Syntax Error'

      return showDebugInfo(e)
    }

    // 对编译结果进行一次包装

    function render (data) {
      try {
        return new Render(data, filename) + ''
      } catch (e) {
        // 运行时出错后自动开启调试模式重新编译
        if (!options.debug) {
          options.debug = true
          return compile(source, options)(data)
        }

        return showDebugInfo(e)()
      }
    }

    render.prototype = Render.prototype
    render.toString = function () {
      return Render.toString()
    }

    if (filename && options.cache) {
      cacheStore[filename] = render
    }

    return render
  }

  // 数组迭代
  const forEach = utils.$each

  // 静态分析模板变量
  const KEYWORDS =
        // 关键字
        'break,case,catch,continue,debugger,default,delete,do,else,false' +
        ',finally,for,function,if,in,instanceof,new,null,return,switch,this' +
        ',throw,true,try,typeof,var,void,while,with' +

        // 保留字
        ',abstract,boolean,byte,char,class,const,double,enum,export,extends' +
        ',final,float,goto,implements,import,int,interface,long,native' +
        ',package,private,protected,public,short,static,super,synchronized' +
        ',throws,transient,volatile' +

        // ECMA 5 - use strict
        ',arguments,let,yield' +

        ',undefined'

  const REMOVE_RE = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g
  const SPLIT_RE = /[^\w$]+/g
  const KEYWORDS_RE = new RegExp(['\\b' + KEYWORDS.replace(/,/g, '\\b|\\b') + '\\b'].join('|'), 'g')
  const NUMBER_RE = /^\d[^,]*|,\d[^,]*/g
  const BOUNDARY_RE = /^,+|,+$/g
  const SPLIT2_RE = /^$|,+/

  // 获取变量
  function getVariable (code) {
    return code
      .replace(REMOVE_RE, '')
      .replace(SPLIT_RE, ',')
      .replace(KEYWORDS_RE, '')
      .replace(NUMBER_RE, '')
      .replace(BOUNDARY_RE, '')
      .split(SPLIT2_RE)
  };

  // 字符串转义
  function stringify (code) {
    return "'" + code
    // 单引号与反斜杠转义
      .replace(/('|\\)/g, '\\$1')
    // 换行符转义(windows + linux)
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n') + "'"
  }

  function compiler (source, options) {
    const debug = options.debug
    const openTag = options.openTag
    const closeTag = options.closeTag
    const parser = options.parser
    const compress = options.compress
    const escape = options.escape

    let line = 1
    const uniq = { $data: 1, $filename: 1, $utils: 1, $helpers: 1, $out: 1, $line: 1 }

    const isNewEngine = ''.trim// '__proto__' in {}
    const replaces = isNewEngine
      ? ["$out='';", '$out+=', ';', '$out']
      : ['$out=[];', '$out.push(', ');', "$out.join('')"]

    const concat = isNewEngine
      ? '$out+=text;return $out;'
      : '$out.push(text);'

    const print = 'function(){' +
        "var text=''.concat.apply('',arguments);" +
        concat +
        '}'

    const include = 'function(filename,data){' +
        'data=data||$data;' +
        'var text=$utils.$include(filename,data,$filename);' +
        concat +
        '}'

    let headerCode = "'use strict';" +
        'var $utils=this,$helpers=$utils.$helpers,' +
        (debug ? '$line=0,' : '')

    let mainCode = replaces[0]

    const footerCode = 'return new String(' + replaces[3] + ');'

    // html与逻辑语法分离
    forEach(source.split(openTag), function (code) {
      code = code.split(closeTag)

      const $0 = code[0]
      const $1 = code[1]

      // code: [html]
      if (code.length === 1) {
        mainCode += html($0)

        // code: [logic, html]
      } else {
        mainCode += logic($0)

        if ($1) {
          mainCode += html($1)
        }
      }
    })

    let code = headerCode + mainCode + footerCode

    // 调试语句
    if (debug) {
      code = 'try{' + code + '}catch(e){' +
            'throw {' +
            'filename:$filename,' +
            "name:'Render Error'," +
            'message:e.message,' +
            'line:$line,' +
            'source:' + stringify(source) +
            ".split(/\\n/)[$line-1].replace(/^\\s+/,'')" +
            '};' +
            '}'
    }

    try {
      const Render = new Function('$data', '$filename', code)
      Render.prototype = utils

      return Render
    } catch (e) {
      e.temp = 'function anonymous($data,$filename) {' + code + '}'
      throw e
    }

    // 处理 HTML 语句
    function html (code) {
      // 记录行号
      line += code.split(/\n/).length - 1

      // 压缩多余空白与注释
      if (compress) {
        code = code
          .replace(/\s+/g, ' ')
          .replace(/<!--[\w\W]*?-->/g, '')
      }

      if (code) {
        code = replaces[1] + stringify(code) + replaces[2] + '\n'
      }

      return code
    }

    // 处理逻辑语句
    function logic (code) {
      const thisLine = line

      if (parser) {
        // 语法转换插件钩子
        code = parser(code, options)
      } else if (debug) {
        // 记录行号
        code = code.replace(/\n/g, function () {
          line++
          return '$line=' + line + ';'
        })
      }

      // 输出语句. 编码: <%=value%> 不编码:<%=#value%>
      // <%=#value%> 等同 v2.0.3 之前的 <%==value%>
      if (code.indexOf('=') === 0) {
        const escapeSyntax = escape && !/^=[=#]/.test(code)

        code = code.replace(/^=[=#]?|[\s;]*$/g, '')

        // 对内容编码
        if (escapeSyntax) {
          const name = code.replace(/\s*\([^\)]+\)/, '')

          // 排除 utils.* | include | print

          if (!utils[name] && !/^(include|print)$/.test(name)) {
            code = '$escape(' + code + ')'
          }

          // 不编码
        } else {
          code = '$string(' + code + ')'
        }

        code = replaces[1] + code + replaces[2]
      }

      if (debug) {
        code = '$line=' + thisLine + ';' + code
      }

      // 提取模板中的变量名
      forEach(getVariable(code), function (name) {
        // name 值可能为空，在安卓低版本浏览器下
        if (!name || uniq[name]) {
          return
        }

        let value

        // 声明模板变量
        // 赋值优先级:
        // [include, print] > utils > helpers > data
        if (name === 'print') {
          value = print
        } else if (name === 'include') {
          value = include
        } else if (utils[name]) {
          value = '$utils.' + name
        } else if (helpers[name]) {
          value = '$helpers.' + name
        } else {
          value = '$data.' + name
        }

        headerCode += name + '=' + value + ','
        uniq[name] = true
      })

      return code + '\n'
    }
  };

  // 定义模板引擎的语法

  defaults.openTag = '{{'
  defaults.closeTag = '}}'

  const filtered = function (js, filter) {
    const parts = filter.split(':')
    const name = parts.shift()
    let args = parts.join(':') || ''

    if (args) {
      args = ', ' + args
    }

    return '$helpers.' + name + '(' + js + args + ')'
  }

  defaults.parser = function (code, options) {
    // var match = code.match(/([\w\$]*)(\b.*)/);
    // var key = match[1];
    // var args = match[2];
    // var split = args.split(' ');
    // split.shift();

    code = code.replace(/^\s/, '')

    let split = code.split(' ')
    const key = split.shift()
    const args = split.join(' ')

    switch (key) {
      case 'if':

        code = 'if(' + args + '){'
        break

      case 'else':

        if (split.shift() === 'if') {
          split = ' if(' + split.join(' ') + ')'
        } else {
          split = ''
        }

        code = '}else' + split + '{'
        break

      case '/if':

        code = '}'
        break

      case 'each':

        var object = split[0] || '$data'
        var as = split[1] || 'as'
        var value = split[2] || '$value'
        var index = split[3] || '$index'

        var param = value + ',' + index

        if (as !== 'as') {
          object = '[]'
        }

        code = '$each(' + object + ',function(' + param + '){'
        break

      case '/each':

        code = '});'
        break

      case 'echo':

        code = 'print(' + args + ');'
        break

      case 'print':
      case 'include':

        code = key + '(' + split.join(',') + ');'
        break

      default:

        // 过滤器（辅助方法）
        // {{value | filterA:'abcd' | filterB}}
        // >>> $helpers.filterB($helpers.filterA(value, 'abcd'))
        // TODO: {{ddd||aaa}} 不包含空格
        if (/^\s*\|\s*[\w\$]/.test(args)) {
          let escape = true

          // {{#value | link}}
          if (code.indexOf('#') === 0) {
            code = code.substr(1)
            escape = false
          }

          let i = 0
          const array = code.split('|')
          const len = array.length
          let val = array[i++]

          for (; i < len; i++) {
            val = filtered(val, array[i])
          }

          code = (escape ? '=' : '=#') + val

          // 即将弃用 {{helperName value}}
        } else if (template.helpers[key]) {
          code = '=#' + key + '(' + split.join(',') + ');'

          // 内容直接输出 {{value}}
        } else {
          code = '=' + code
        }

        break
    }

    return code
  }

  // RequireJS && SeaJS
  if (typeof define === 'function') {
    define('artTemplate', [], function () {
      return template
    })

    // NodeJS
  } else if (typeof exports !== 'undefined') {
    module.exports = template
  } else {
    this.template = template
  }
})()
