function addMeasureFieldset(columnList) {
  var measureFieldset = $("<div />").attr("class", "measure-fieldset").append(
    $("<div />").attr("class", "measure-form").dxForm({
      formData: {
        sqlColumn: "",
        condition: "",
        code: "Measure",
        titleMeasure: "Мера",
        type: "number",
        unitOfMeasurement: "",
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
          text: "Код меры"
        },
      }, {
        dataField: "titleMeasure",
        label: {
          text: "Название меры"
        },
      }, {
        dataField: "type",
        label: {
          text: "Тип меры"
        },
        editorType: "dxSelectBox",
        editorOptions: {
          items: ["number", "sum", "avg", "count"],
          value: "number"
        },
      }, {
        dataField: "unitOfMeasurement",
        label: {
          text: "Единица измерения"
        },
      }, {
        dataField: "condition",
        label: {
          text: "Дополнительная фильтрация"
        },
      },
      ]
    }),
    $("<div />").attr("class", "remove").dxButton({
      text: "Удалить",
      onClick: function (e) {
        $(e.element).closest('.measure-fieldset').remove();
      }
    }));
  $("#measures-fieldset-wrapper").append(measureFieldset);
}

function getMeasuresData() {
  var measures = [];
  $(".measure-form").each(function (index, value) {
    var measureForm = $(this).dxForm("instance").option('formData');
    var measureObject = {
      "code": measureForm.code,
      "titleMeasure": [
        {
          "localeCode": "ru",
          "value": measureForm.titleMeasure
        }
      ],
      "sqlColumn": measureForm.sqlColumn,
      "type": measureForm.type,
      "condition": measureForm.condition,
      "unitOfMeasurement": measureForm.unitOfMeasurement
    };
    measures[index] = measureObject;
  });
  console.log(measures);
  return measures;
}
