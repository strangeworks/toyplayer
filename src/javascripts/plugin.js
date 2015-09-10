var $ = require('jquery');

  var pluginDataSuffix = '.plugin';

  if (typeof $.fn.plugin === 'undefined') {
    $.fn.plugin = function(pluginName) {
      return $(this).first().data(pluginName + pluginDataSuffix)
    }
  }

  module.exports = function Plugin(name, PluginClass) {
    var dataName = name + pluginDataSuffix

    function PluginFactory(option, params) {
      return this.each(function (i, elem) {
        var $element  = $(elem),
            plugin    = $element.data(dataName),
            options   = $.extend({}, PluginClass.DEFAULTS, $element.data(), typeof option == 'object' && option)

        if (!plugin)
          $element.data(dataName, (plugin = new PluginClass($element, options)))

        if (typeof option == 'string')
          plugin[option](params)
      })
    }

    $.fn[name] = PluginFactory
    $.fn[name].Constructor = PluginClass
  }
