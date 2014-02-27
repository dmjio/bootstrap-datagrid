(function($){

  var bg3 = function(placeholder, title, hasHover, isStriped, isResponsive, isCondensed, isBordered) { 
    return '<div class="text-center panel panel-default">' +          
    '<!-- Heading -->' +
    '<div class="panel-heading"><p id="boogrid-title">' + title + '</p></div>' +
    '<div class="panel-body">'+
    '<div class="row">' +
       '<div class="col-sm-12">' +
          '<div class="input-group input-group-md">' +
            '<span class="input-group-addon">' +
            '<span class="glyphicon glyphicon-search"></span>' +
            '</span>' +
            '<input type="text" id="boogrid-search" class="form-control" placeholder="' + placeholder + '">' +
            '<span class="input-group-btn">' +
              '<button class="btn btn-danger" id="boogrid-search-clear" type="button">' +
                '<span class="glyphicon glyphicon-remove"></span>' +
              '<button class="btn btn-success" id="boogrid-refresh" type="button">' +
                '<span class="glyphicon glyphicon-refresh"></span></button>' +
              '<div class="btn-group hidden-xs">' +
                '<button class="btn btn-default btn-md dropdown-toggle " ' +
                        'id="boogrid-count-btn"' +
                        'type="button" ' +
                        'data-toggle="dropdown"><span class="caret"></span>' +
                '</button>' +
                '<ul class="dropdown-menu" role="menu" id="counts">' +
                '</ul>' +
              '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<!-- Grid Data -->' +
    '<table class="table ' + (isResponsive ? "table-responsive " : " ")
    + (hasHover ? "table-hover " : " ") 
    + (isCondensed ? "table-condensed " : " ") 
    + (isBordered ? "table-bordered " : " ") 
    + (isStriped ? "table-striped " : " ") + '\" id="table">' +
    '</table>' +
  '</div>' +
'</div>' +
'</div>' +
'<div class="text-center container" style="margin-top:-20px">' +
  '<ul id="pager" class="pagination-md pagination">' +
  '</ul>' +
  '<div id="txtInfo"></div>' +
'</div>' }

  $.fn.boogrid = function(obj){
    var sel, tmpl, search;
    sel = this, tmpl = $("#booGridTmpl"), search = $("#boogrid-search"), title = $("#boogrid-title");
    var bg3html = bg3(obj.placeholder, obj.title, obj.hasHover, obj.isStriped, obj.isResponsive, obj.isCondensed, obj.isBordered);
    $(sel).empty().append($(bg3html));
    var btnText = function(count) { return "<span class=\"caret\"></span> Row(s) per page: " + count;  }
    $("#boogrid-count-btn").html(btnText(obj.startingDisplayCount));

    /* validation */
    if (!obj.title) title.text("Bootstrap 3 Grid!");
    else title.text(obj.title);

    if (!obj || !obj.data) {
      console.log("Boogrid needs data to work...");
      return;
    }

    /* placeholder updates */
    if (!obj.searchPlaceholder) $("#boogrid-search").attr("placeholder", "Search...");
    else $("#boogrid-search").attr("placeholder", obj.searchPlaceholder);

    /* initial grid creation based on settings object */
    var tmpl = function template(o){
      if (o.length < 1){
        $('#table').empty().append($('<thead><tr><th>No data found</th></tr></thead><tbody>hi</tbody>'));                              
        return;
      }
      
      var html = '<thead><tr>';
      _.each(obj.order, function(item,key,list){ 
        if (obj.responsiveHiding[item]) {
          var hideClasses = "";
          _.each(obj.responsiveHiding[item], function(x) {
            hideClasses += (" hidden-" + x + " ");
          });
        }
        if (obj.sortable[item])
          html += '<th class="text-center' + hideClasses + '"><a>' + item + '</a></th>';
        else 
          html += '<th class="text-center' + hideClasses + '">' + item + '</th>';
      });

      html += '</thead><tbody>';
      _.each(o, function(item,key,list){ 
        html += '<tr data-id="' + item[obj.order[0]] + '">';
        _.each(obj.order, function(i,k,l) {  
          var hideClasses = "";
          _.each(obj.responsiveHiding[i], function(x) {
            hideClasses += (" hidden-" + x + " ");
          });
          if (obj.formatCols[i]) 
            html += '<td class="' + hideClasses + '">' + obj.formatCols[i](item[i]) + '</td>';
          else 
            html += '<td class="' + hideClasses + '">' + item[i] +  '</td>';
        });
        html += '</tr>';
      }); 
      html += '</tbody>';
      $('#table').empty().append($(html));                              
    };

    if (!obj.displayCounts || obj.displayCounts.length < 1) {
      /* default value */
      $("#counts").append("<li><a>5</a></li><li><a>10</a></li><li><a>20</a></li><li><a>50</a></li>");
    } else {
      var html = "";
      _.each(obj.displayCounts, function(item,key,x){
        html += ("<li><a>" + item + "</a></li>");
      });
      $("#counts").append($(html));
    }

    /* event handlers */
    $("#boogrid-search-clear").click(function(){
      var $search = $("#boogrid-search");
      if (!$search.val()) return;
      $search.val("");
      $("#table").empty();
      obj.currIdx = 1;
      updateGrid(obj.data);
    });

    /* paging updates */
    $(document).on("click", "ul.dropdown-menu li a", function(e){
      var btn = $("#boogrid-count-btn");
      var countPerRow = $(this).text();
      btn.html(btnText(countPerRow));
      obj.startingDisplayCount = countPerRow;
      updateGrid(obj.data);
    });

    var updatePaging = function(pageCount, currIdx){
      $("#pager").empty();
      var btn = function(type) { 
        var disabled = "";
        var btnIcon = '\u2192';
        if (type === "Previous")
          btnIcon = '\u2190';
        if (currIdx === 1 && type === "Previous") 
          disabled = 'disabled'
        if (currIdx === pageCount && type === "Next")
          disabled = 'disabled'
        typ = type.substring(0,1).toLowerCase() + type.substring(1);
        if (type === "Next")
          return '<li id="boogrid-' + typ + '-btn" class="' + typ + ' ' + disabled + '"><a href="#">' + type + ' ' + btnIcon + ' ' + '</a></li>'; 
        return '<li id="boogrid-' + typ + '-btn" class="' + typ + ' ' + disabled + '"><a href="#">' + btnIcon + ' ' + type + ' ' + '</a></li>'; 
     } 

      var left, right, nums, disabled;
      nums = "", disabled = "";
      left = btn("Previous");
      right = btn("Next");
      for (var i = 1; i <= pageCount; i++) {
        nums += ('<li class="' + (i === obj.currIdx ? "active" : "") + '" data-id=\"' + i + '\" ><a href="#">' + i + '<span class="sr-only">(current)</span></a></li>');
      }

      $('#pager').append($(left + nums + right));
      if (currIdx <= 1) $("#boogrid-back-btn").attr("disabled","disabled");
      else $("#boogrid-back-btn").removeAttr("disabled");
      if (currIdx === pageCount) $("#boogrid-next-btn").attr("disabled","disabled");
      else $("#boogrid-next-btn").removeAttr("disabled");
    };
    
    /* handle row clicking */
    $(document).on("click", "#table tr", function(evt){
      var id = $(this).data("id");
      if (!id) return false; /* looking for <th> here */
      var result = _.find(obj.data, function(o) { return o[obj.idField] === id });
      obj.rowClick(result);
    })

    var rev = true; /* grid sorting */
    $(document).on("click", "tr th a", function(){
      var val = $(this).text();
      console.log(val);
      var list = _.sortBy(obj.data, function(o) {
        return o[val];
      });
      if (rev) {
        console.log(rev, 'rev');
        list = list.reverse();
      }
      rev = !rev;
      updateGrid(list);
    });

    /* refresh button */
    $(document).on("click", "#boogrid-refresh", function(){
      $.get(obj.getURL, function(data) {
        console.log(obj.getUrl);
        console.log(data);
      }).error(obj.errHandler);
    });

    /* search */
    $(document).on("keyup", "#boogrid-search", function(evt){
      obj.currIdx = 1;
      var keyword = $(this).val();
      var newobjs = _.filter(obj.data, function(o){
        var result = false;
        _.each(obj.filterBy, function(name,b,c){
          if (o[name].toString().indexOf(keyword) > -1) 
            result = true;
        });
        return result;
      });
      updateGrid(newobjs);
    });

    /* handle pagination */
    $(document).on("click", "#boogrid-next-btn", function(){
      if ($(this).hasClass('disabled'))
        return;
      obj.currIdx++;
      updateGrid(obj.data);
    });

    $(document).on("click", "#boogrid-previous-btn", function(){
      if ($(this).hasClass('disabled')) return;
      obj.currIdx--;
      updateGrid(obj.data);
    });

    $(document).on("click", "ul#pager li", function(){
      if ($(this).hasClass('disabled')) return;
      var val = $(this).data("id");
      if (!val) return; /* this means we've hit the previous or next  button */
      obj.currIdx = val;
      updateGrid(obj.data);
    });

    var updateGrid = function(newobjs) {
      /* filter the results first */
      var keyword = $("#boogrid-search").val();
      if (keyword) {
        newobjs = _.filter(obj.data, function(o){
          var result = false;
          _.each(obj.filterBy, function(name,b,c){
            if (o[name].toString().indexOf(keyword) > -1) 
              result = true;
          });
          return result;
        });
      }

      /* take into account pagination */
      var os = _.drop(newobjs, obj.startingDisplayCount * (obj.currIdx - 1) /* not 0 based so -1*/);
      os = _.take(os, obj.startingDisplayCount);

      /* update page counter at bottom */
      var pc = Math.ceil(newobjs.length / obj.startingDisplayCount);
      updatePaging(pc, obj.currIdx);

      $("#txtInfo").empty().html('<p>Displaying <label label-primary>' + os.length + '</label> of <label label-primary>' + newobjs.length + '</p>');

      /* retemplate */
      $("#table").empty().append(tmpl(os));
    };

    /* initial templating */
    obj.currIdx = 1;
    updateGrid(obj.data);
  }

}(jQuery));
