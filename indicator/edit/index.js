$(function () {
  DevExpress.localization.locale(navigator.language);
  var indicatorStructure = {
    code: null,
    meta: {
      dbType: "",
      dataSource: "",
      schemaName: "",
      viewType: "",
      viewName: "",
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
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var iid = urlParams.get('iid');
  console.log(iid);
  $.getJSON('http://10.0.3.209:7002/api/v2/indicator-core/registry/indicator/' + iid, function (indicatorJson) {
    console.log(indicatorJson);
    indicatorStructure.code = $("#indicator-code").dxTextBox({
      value: indicatorJson.code ? indicatorJson.code : "",
    }).dxTextBox("instance");

    indicatorStructure.meta.indicatorNameRus = $("#indicator-name").dxTextBox({
      value: indicatorJson.meta.indicatorNameRus ? indicatorJson.meta.indicatorNameRus : ""
    }).dxTextBox("instance");

    indicatorStructure.meta.indicatorNameEng = $("#indicator-name-eng").dxTextBox({
      value: indicatorJson.meta.indicatorNameEng ? indicatorJson.meta.indicatorNameEng : ""
    }).dxTextBox("instance");

    var refreshTimePeriod = [
      "day", "month", "year"
    ];
    indicatorStructure.meta.refreshTime = $("#indicator-refresh-time").dxSelectBox({
      items: refreshTimePeriod,
      value: indicatorJson.meta.refreshTime ? indicatorJson.meta.refreshTime : "",
    }).dxSelectBox("instance");

    indicatorStructure.meta.scheduledRefreshTimer = $("#indicator-scheduled-refresh-timer").dxTextBox({
      value: indicatorJson.meta.scheduledRefreshTimer ? indicatorJson.meta.scheduledRefreshTimer : 0,
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
      height: 90,
      value: indicatorJson.meta.description[0].value ? indicatorJson.meta.description[0].value : "",
    }).dxTextArea("instance");

    var columnsList;
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
      var datasourceId = indicatorJson.meta.dataSource;
      var schemaName = indicatorJson.meta.schemaName;
      var tableName = indicatorJson.meta.tableName;
      console.log(IP_TO_SETTINGS_CORE + datasourceId + "/schema/" + schemaName + "/table/" + tableName + "/column-list");
      $.getJSON(IP_TO_SETTINGS_CORE + datasourceId + "/schema/" + schemaName + "/table/" + tableName + "/column-list", function (columns) {
        columnsList = columns;

        indicatorJson.dimensions.forEach(function (value, index) {
          console.log(columnsList);
          addDimensionFieldset(value, columnsList);
        });

        indicatorJson.timeDimensions.forEach(function (value, index) {
          addTimeDimensionFieldset(value, columnsList);
        });

        indicatorJson.measures.forEach(function (value, index) {
          addMeasureFieldset(value, columnsList);
        });

        indicatorJson.preFiltered.forEach(function (value, index) {
          addPrefilter(value, columnsList);
        });
      });
    };
    setColumns();

    $("#add-dimension").dxButton({
      text: "Добавить измерение",
      onClick: function () {
        addDimensionFieldset(null, columnsList);
      }
    });

    $("#add-time-dimension").dxButton({
      text: "Добавить измерение времени",
      onClick: function () {
        addTimeDimensionFieldset(null, columnsList);
      }
    });

    $("#add-measure").dxButton({
      text: "Добавить меру",
      onClick: function () {
        addMeasureFieldset(null, columnsList);
      }
    });

    $("#add-pre-filter").dxButton({
      text: "Добавить префильтр",
      onClick: function () {
        addPrefilter(null, columnsList);
      }
    });


    var getIndicatorData = function () {
      var indicatorData = {
        "code": indicatorStructure.code.option("value"),
        "meta": {
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
        updateIndicator(query);
        console.log('saved');
      }
    }).dxButton("instance");

  });
});
