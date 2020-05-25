function addDimensionFieldset(dimensionObject = null,columnList) {
  var dimensionFieldset = $("<div />").attr("class", "dimension-fieldset").append(
    $("<div />").attr("class", "dimension-form").dxForm({
      formData: {
        sqlColumn: dimensionObject !== null ? dimensionObject.sqlColumn : "",
        code: dimensionObject !== null ? dimensionObject.code : "",
        titleDim: dimensionObject !== null ? dimensionObject.titleDim[0].value : "",
        type: dimensionObject !== null ? dimensionObject.type : "",
        unitOfMeasurement: dimensionObject !== null ? dimensionObject.unitOfMeasurement : "",
        isVisible: dimensionObject !== null ? dimensionObject.isVisible : true,
        isPrimaryKey: dimensionObject !== null ? dimensionObject.isPrimaryKey : false
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
        dataField: "type",
        label: {
          text: "Тип измерения"
        },
        editorType: "dxSelectBox",
        editorOptions: {
          items: ["string", "number"],
        },
      }, {
        dataField: "unitOfMeasurement",
        label: {
          text: "Единица измерения"
        },
      }, {
        dataField: "isVisible",
        label: {
          text: "Активно"
        },
      }, {
        dataField: "isPrimaryKey",
        label: {
          text: "Первичный ключ"
        },
      },
      ]
    }),
    $("<div />").attr("class", "remove").dxButton({
      text: "Удалить",
      onClick: function (e) {
        $(e.element).closest('.dimension-fieldset').remove();
      }
    }));
  $("#dimensions-fieldset-wrapper").append(dimensionFieldset);
}

function getDimensionsData() {
  var dimensions = [];
  $(".dimension-form").each(function (index, value) {
    var dimentionForm = $(this).dxForm("instance").option('formData');
    var dimensionObject = {
      "code": dimentionForm.code,
      "titleDim": [
        {
          "localeCode": "ru",
          "value": dimentionForm.titleDim
        }
      ],
      "sqlColumn": dimentionForm.sqlColumn,
      "isVisible": dimentionForm.isVisible,
      "isPrimaryKey": dimentionForm.isPrimaryKey,
      "type": dimentionForm.type,
      "unitOfMeasurement": dimentionForm.unitOfMeasurement
    };
    dimensions[index] = dimensionObject;
  });
  console.log(dimensions);
  return dimensions;

}
