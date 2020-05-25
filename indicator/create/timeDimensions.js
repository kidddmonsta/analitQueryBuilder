function addTimeDimensionFieldset(columnList) {
  var dimensionFieldset = $("<div />").attr("class", "time-dimension-fieldset").append(
    $("<div />").attr("class", "time-dimension-form").dxForm({
      formData: {
        sqlColumn: "",
        code: "TimeDimension",
        titleDim: "Измерение времени",
        timeInterval: "day",
        dateFrom: "",
        dateTo: "",
      },
      items: [{
        dataField: "sqlColumn",
        label: {
          text: "Поле таблицы"
        },
        editorType: "dxSelectBox",
        editorOptions: {
          items: columnList,
          searchEnabled: true,
          value: ""
        },
      }, {
        dataField: "code",
        label: {
          text: "Код измерения"
        },
      }, {
        dataField: "titleDim",
        label: {
          text: "Название измерения"
        },
      }, {
        dataField: "timeInterval",
        label: {
          text: "Тип измерения"
        },
        editorType: "dxSelectBox",
        editorOptions: {
          items: ["day", "week", "month", "year"],
          value: "day"
        },
      }, {
        dataField: "dateFrom",
        label: {
          text: "Начало периода"
        },
        editorType: "dxDateBox",
        editorOptions: {
          value: null,
          width: "100%",
          displayFormat: "yyyy-MM-dd",
          dateSerializationFormat: "yyyy-MM-dd",
        },
      }, {
        dataField: "dateTo",
        label: {
          text: "Конец периода"
        },
        editorType: "dxDateBox",
        editorOptions: {
          value: null,
          width: "100%",
          displayFormat: "yyyy-MM-dd",
          dateSerializationFormat: "yyyy-MM-dd",
        },
      },
      ]
    }),
    $("<div />").attr("class", "remove").dxButton({
      text: "Удалить",
      onClick: function (e) {
        $(e.element).closest('.time-dimension-fieldset').remove();
      }
    }));
  $("#time-dimensions-fieldset-wrapper").append(dimensionFieldset);
}

function getTimeDimensionsData() {
  var dimensions = [];
  $(".time-dimension-form").each(function (index, value) {
    var form = $(this).dxForm("instance").option('formData');
    var dimensionObject = {
      "code": form.code,
      "titleDim": [
        {
          "localeCode": "ru",
          "value": form.titleDim
        }
      ],
      "sqlColumn": form.sqlColumn,
      "timeInterval": form.timeInterval,
      "dateRange": [
        form.dateFrom,
        form.dateTo
      ]
    };
    dimensions[index] = dimensionObject;
  });
  console.log(dimensions);
  return dimensions;
}
