$(function () {
  DevExpress.localization.locale(navigator.language);

  var dbOptionsForm, saveButton, dataSourceCode, dataSourceData = null;
  var getAllDataSources = function () {
    $.getJSON(IP_TO_DATA_SOURCE_CORE, function (dataSourceList) {
      console.log(dataSourceList);
      dataSourceCode = $("#data-source-list").dxSelectBox({
        items: dataSourceList.items,
        valueExpr: "id",
        displayExpr: "name",
        onValueChanged: function (dataSourceName) {
          console.log(dataSourceName);
          initEditForm(dataSourceName.value);
        }
      }).dxSelectBox("instance");
    });
  };
  getAllDataSources();
  var initEditForm = function (dataSourceId) {
    console.log(IP_TO_DATA_SOURCE_CORE + "/" + dataSourceId);
    $.getJSON(IP_TO_DATA_SOURCE_CORE + "/" + dataSourceId, function (dataSource) {
      console.log(dataSource);
      dataSourceData = dataSource;
      var dbFields = {
        "name": dataSource.name,
        "sourceType": dataSource.sourceType,
        "rawConnectionString": dataSource.rawConnectionString
      };
      dbOptionsForm = $("#settings-form").dxForm({
        formData: dbFields,
        readOnly: false,
        showColonAfterLabel: true,
        labelLocation: "top",
        minColWidth: 300,
        colCount: 1
      }).dxForm("instance");
    });
    $(".settings-form").show();
  };

  var getData = function () {
    var data = dbOptionsForm.option("formData");
    return data;
  };

  var updateDataSource = function (query) {
    console.log('update');
    $.ajax({
      type: 'PATCH',
      url: IP_TO_DATA_SOURCE_CORE + "/" + dataSourceData.id,
      data: JSON.stringify(query),
      processData: false,
      contentType: 'application/merge-patch+json',
    }).done(function (data) {
      console.log(data);
      dataSourceData = data;
      $("#CRUD-result").html('<h3>Обновленный источник данных</h3><p><pre>' + JSON.stringify(data, null, 2) + "</pre></p>");
    });
  };
  saveButton = $("#save-connection").dxButton({
    text: "Сохранить",
    onClick: function () {
      var query = getData();
      console.log(query);
      updateDataSource(query);
      console.log('saved');
    }
  }).dxButton("instance");


});
