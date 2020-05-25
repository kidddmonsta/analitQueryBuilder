function addPrefilter(columnList) {
  var preFilterFieldset = $("<div />").attr("class", "pre-filter-fieldset").append(
    $("<div />").attr("class", "pre-filter-form").dxForm({
      formData: {
        dimCode: "",
        alias: "PreFilter",
        values: "",
      },
      items: [{
        dataField: "alias",
        label: {
          text: "Название"
        },
      }, {
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
        dataField: "values",
        label: {
          text: "Значения"
        },
      }
      ]
    }),
    $("<div />").attr("class", "remove").dxButton({
      text: "Удалить",
      onClick: function (e) {
        $(e.element).closest('.pre-filter-fieldset').remove();
      }
    }));
  $("#pre-filters-fieldset-wrapper").append(preFilterFieldset);
}

function getPreFiltersData() {
  var preFilters = [];
  $(".pre-filter-form").each(function (index, value) {
    var preFilterForm = $(this).dxForm("instance").option('formData');
    var preFilterObject = {
      "alias": preFilterForm.alias,
      "rules": [
        {
          "dimCode": preFilterForm.sqlColumn,
          "values": [preFilterForm.values]
        }
      ]
    };
    preFilters[index] = preFilterObject;
  });
  console.log(preFilters);
  return preFilters;
}
