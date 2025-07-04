fetch('jsontest.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        console.log("===========");
        console.log(data[0][0]);//테스트용으로 첫번째 데이터 8 접근
    });