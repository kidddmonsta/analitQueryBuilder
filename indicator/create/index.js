$(function () {
  DevExpress.localization.locale(navigator.language);
  var indicatorJson = null;
  var saveButton;
  var indicatorStructure = {
    code: null,
    meta: {
      dbType: "",
      dataSource: "",
      schemaName: "",
      viewType: "",
      tableName: "",
      indicatorNameRus: "",
      indicatorNameEng: "",
      description: "",
      refreshTime: "",
      scheduledRefreshTimer: "",
      actualDateFrom: "",
      actualDateTo: "",
    },
    measures: null,
    dimensions: null,
    timeDimensions: null,
    preFiltered: null,
  };
  var columnsList = [];
  indicatorStructure.code = $("#indicator-code").dxTextBox({
    value: "Indicator" + Math.random(),
  }).dxTextBox("instance");

  indicatorStructure.meta.indicatorNameRus = $("#indicator-name").dxTextBox({
    value: "Показатель"
  }).dxTextBox("instance");

  indicatorStructure.meta.indicatorNameEng = $("#indicator-name-eng").dxTextBox({
    value: "Indicator"
  }).dxTextBox("instance");

  var refreshTimePeriod = [
    "day", "month", "year"
  ];
  indicatorStructure.meta.refreshTime = $("#indicator-refresh-time").dxSelectBox({
    items: refreshTimePeriod,
    value: refreshTimePeriod[0],
  }).dxSelectBox("instance");

  indicatorStructure.meta.scheduledRefreshTimer = $("#indicator-scheduled-refresh-timer").dxTextBox({
    value: 600
  }).dxTextBox("instance");

  indicatorStructure.meta.actualDateFrom = $("#indicator-date-from").dxDateBox({
    type: "datetime",
    displayFormat: "yyyy-MM-dd",
    dateSerializationFormat: "yyyy-MM-dd",
    value: new Date()
  }).dxDateBox("instance");

  indicatorStructure.meta.actualDateTo = $("#indicator-date-to").dxDateBox({
    type: "datetime",
    displayFormat: "yyyy-MM-dd",
    dateSerializationFormat: "yyyy-MM-dd",
    value: new Date()
  }).dxDateBox("instance");

  indicatorStructure.meta.description = $("#indicator-description").dxTextArea({
    height: 90
  }).dxTextArea("instance");

  var sourceType = [
    "База данных", "API"
  ];
  indicatorStructure.meta.sourceType = $("#indicator-source-type").dxSelectBox({
    items: sourceType,
    value: sourceType[0],
  }).dxSelectBox("instance");
  var schemaList = [];
  $.getJSON(IP_TO_DATA_SOURCE_CORE, function (dataSourceList) {

    indicatorStructure.meta.dataSource = $("#indicator-db-connector").dxSelectBox({
      items: dataSourceList.items,
      valueExpr: "id",
      displayExpr: "name",
      onValueChanged: function (dataSource) {
        console.log(dataSource.value);
        $.getJSON(IP_TO_SETTINGS_CORE + dataSource.value + "/schema-list", function (schemas) {
          schemaList = schemas;
          indicatorStructure.meta.schemaName.option('items', schemaList);
          indicatorStructure.meta.schemaName.option('disabled', false);
          console.log(schemaList);
        });
      }
    }).dxSelectBox("instance");
  });

  var setTables = function () {
    var datasourceId = indicatorStructure.meta.dataSource.option("value");
    var schemaName = indicatorStructure.meta.schemaName.option("value");
    var viewType = indicatorStructure.meta.viewType.option("value");
    $.getJSON(IP_TO_SETTINGS_CORE + datasourceId + "/schema/" + schemaName + "/table-list?presentType=" + viewType, function (tables) {
      console.log(tables);
      indicatorStructure.meta.tableName.option('items', tables);
      indicatorStructure.meta.tableName.option('disabled', false);
    });
  };
  indicatorStructure.meta.schemaName = $("#indicator-schema").dxSelectBox({
    items: schemaList,
    disabled: true,
    searchEnabled: true,
    onValueChanged: function (schemaName) {
      console.log(schemaName.value);
      indicatorStructure.meta.viewType.option('disabled', false);
      setTables();
    }
  }).dxSelectBox("instance");

  var viewType = [
    {
      id: "table",
      val: "таблица"
    },
    {
      id: "view",
      val: "представление"
    },
    {
      id: "matview",
      val: "материальное представление"
    },
  ];
  indicatorStructure.meta.viewType = $("#indicator-view-type").dxSelectBox({
    disabled: true,
    items: viewType,
    valueExpr: "id",
    displayExpr: "val",
    value: "table",
    onValueChanged: function (viewType) {
      console.log(viewType.value);
      setTables();
    }
  }).dxSelectBox("instance");

  var updateFieldsSelect = function (blockId, columnsList) {
    $(blockId).each(function (index, value) {
      $(this).dxForm("instance").itemOption("sqlColumn", {
        editorOptions: {
          items: columnsList,
          value: ""
        }
      });
    });
  };
  var setColumns = function () {
    var datasourceId = indicatorStructure.meta.dataSource.option("value");
    var schemaName = indicatorStructure.meta.schemaName.option("value");
    var tableName = indicatorStructure.meta.tableName.option("value");
    $.getJSON(IP_TO_SETTINGS_CORE + datasourceId + "/schema/" + schemaName + "/table/" + tableName + "/column-list", function (columns) {
      columnsList = columns;
      updateFieldsSelect(".dimension-form", columnsList);
      updateFieldsSelect(".measure-form", columnsList);
      updateFieldsSelect(".time-dimension-form", columnsList);
      updateFieldsSelect(".pre-filter-form", columnsList);
    });
  };
  indicatorStructure.meta.tableName = $("#indicator-view").dxSelectBox({
    disabled: true,
    searchEnabled: true,
    onValueChanged: function (tableName) {
      console.log(tableName.value);
      setColumns();
    }
  }).dxSelectBox("instance");

  $("#add-dimension").dxButton({
    text: "Добавить измерение",
    onClick: function () {
      addDimensionFieldset(columnsList);
    }
  });
  $("#add-time-dimension").dxButton({
    text: "Добавить измерение времени",
    onClick: function () {
      addTimeDimensionFieldset(columnsList);
    }
  });
  $("#add-measure").dxButton({
    text: "Добавить меру",
    onClick: function () {
      addMeasureFieldset(columnsList);
    }
  });
  $("#add-pre-filter").dxButton({
    text: "Добавить префильтр",
    onClick: function () {
      addPrefilter(columnsList);
    }
  });

  var getIndicatorData = function () {
    var indicatorData = {
      "code": indicatorStructure.code.option("value"),
      "meta": {
        "dbType": "database",
        "dataSource": indicatorStructure.meta.dataSource.option("value"),
        "schemaName": indicatorStructure.meta.schemaName.option("value"),
        "tableName": indicatorStructure.meta.tableName.option("value"),
        "sql": "",
        "indicatorNameRus": indicatorStructure.meta.indicatorNameRus.option("value"),
        "indicatorNameEng": indicatorStructure.meta.indicatorNameEng.option("value"),
        "description": [
          {
            "localeCode": "rus",
            "value": indicatorStructure.meta.description.option("value")
          }
        ],
        "refreshTime": indicatorStructure.meta.refreshTime.option("value"),
        "scheduledRefreshTimer": indicatorStructure.meta.scheduledRefreshTimer.option("value"),
        "actualDateFrom": indicatorStructure.meta.actualDateFrom.option("value"),
        "actualDateTo": indicatorStructure.meta.actualDateTo.option("value")
      },
      "measures": getMeasuresData(),
      "dimensions": getDimensionsData(),
      "timeDimensions": getTimeDimensionsData(),
      "preFiltered": getPreFiltersData()
    };
    console.log(indicatorData);
    return indicatorData;
  };

  var createIndicator = function (query) {
    console.log('create');
    $.post(IP_TO_INDICATOR_CORE, JSON.stringify(query), function (data) {
      console.log(data);
      indicatorJson = data;
      $("#CRUD-result").html('<h3>Источник данных:</h3><p><pre>' + JSON.stringify(data, null, 2) + "</pre></p>");
    });
  };
  var updateIndicator = function (query) {
    console.log('update');
    $.ajax({
      type: 'PATCH',
      url: IP_TO_INDICATOR_CORE + "/" + indicatorJson.id,
      data: JSON.stringify(query),
      processData: false,
      contentType: 'application/merge-patch+json',
    }).done(function (data) {
      console.log(data);
      indicatorJson = data;
      $("#CRUD-result").html('<h3>Обновленный источник данных</h3><p><pre>' + JSON.stringify(data, null, 2) + "</pre></p>");
    });
  };
  saveButton = $("#save-indicator").dxButton({
    text: "Сохранить",
    onClick: function () {
      var query = getIndicatorData();
      console.log(query);
      if (indicatorJson == null) {
        createIndicator(query);
      } else {
        updateIndicator(query);
      }
      console.log('saved');
    }
  }).dxButton("instance");


});
