
$(document).ready(() => {

    let $table = $('#table');
    let $startDt = $('#startDt');
    let $endDt = $('#endDt');
    
    let dataTableConfig = {
        language:  {
            "emptyTable": "沒有資料，請變更搜尋或篩選條件",
            "processing": "處理中...",
            "loadingRecords": "載入中...",
            "lengthMenu": "_MENU_",
            "___lengthMenu": "顯示 _MENU_ 項結果",
            "zeroRecords": "沒有符合的結果",
            "info": "第 _START_ ~ _END_ 項，共 _TOTAL_ 項",
            "infoEmpty": "第 0 至 0 項，共 0 項",
            "infoFiltered": "(從 _MAX_ 項結果中過濾)",
            "infoPostFix": "",
            "search": "搜尋:",
            "paginate": {
              "first": "第一頁",
              "previous": "上一頁",
              "next": "下一頁",
              "last": "最後一頁"
            },
            "aria": {
              "sortAscending": ": 升冪排列",
              "sortDescending": ": 降冪排列"
            }
        }
    }
    
    let datatable = $table.DataTable(dataTableConfig);

    $startDt.datepicker();
    $endDt.datepicker();

    function getData(index = 0) {

        return callSearchDataApi(index)
        .then(response => {

            generateTableData(response);

            if(response.length == 10) {
                // get more data
                return getData(index+10);
            } else {
                return;
            }
        })
        .catch(error => {
            console.error(error)
        })
    }

    function generateTableData (docs) {
        // handle docs
        let rows = docs.map(doc => {
            // [ 時間, 用戶, 問句, intent, 信心, 回覆 ]
            return [ 
                new Date(doc.apiCall).toLocaleString(),
                doc.user,
                doc.text,
                doc.assistantOut.intents[0]?.intent || '',
                doc.assistantOut.intents[0]?.confidence || '',
                doc.messages
            ]
        })
        datatable.rows.add(rows).draw();
    }

    

    function callSearchDataApi(index) {
        return new Promise((resolve, reject) => {      
            setTimeout(() => {
                resolve(data.slice(index, index+10));
            }, 1000 + Math.floor(Math.random()*2000));
        })
    }

    getData();
});


