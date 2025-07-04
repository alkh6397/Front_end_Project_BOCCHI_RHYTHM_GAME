//변수 영역
const game = document.getElementById('game');//game 영역을 Id참조
const scoreDisplay = document.getElementById('score');//score 영역을 Id참조
const lanes = ['D', 'F', 'J', 'K'];//D, F, J, K 문자 배열
const laneX = { D: 0, F: 100, J: 200, K: 300 };//D, F, J, K 레인의 노트의 X좌표
let offset = 30;//판정 범위(클수록 널널하고 작을 수록 깐깐함)<--사용자가 값 조절할 가능성 염두 let선언
let score = 0;//점수
let notes = [];//노트를 담을 리스트
let recent_note;//최근에 생성된 노트를 담을 변수<---연속으로 동일 노트가 나오면 게임이 너무 어려우니 방지해주기 위함
let note_num = 4;//몇번 레인의 노트를 떨굴지 번호 지정
let note_json_col = 0;
let note_json_row = 0;
let note_count = 0;
let BPM = 190;
let game_finished = 0;
let main_interval_id1;//코드를 진행시키는 가장 주요한 setInterval에 대한 id<--나중에 게임 멈출때 clearInterval에 전달해줄 id때문에 선언됨
let main_interval_id2;//위와 마찬가지 

//신규 노트 생성
function createNote() {
    //console.log("create");
    //const direction = lanes[Math.floor(Math.random() * lanes.length)];//0~3의 인덱스 생성.->D, F, J, K 중 랜덤으로 1가지 생성
    setNotenum();
    if(note_num == 4){
        return;
    }
    const direction = lanes[note_num];//note_num 0, 1, 2, 3에 따라 생성할 노트 지정
    const note = document.createElement('div');//div태그를 만들겠다.
    note.className = 'note';//note의 클래스는 note
    note.style.left = laneX[direction] + 'px';//x좌표 값에 따라 left로 위치시키겠다.
    note.style.top = '0px';//상단에서 내려와야하므로 top은 0px
    note.dataset.direction = direction;//dataset에 방향을 설정(D, F, J, K)
    game.appendChild(note);//game영역의 자식요소로 추가
    notes.push(note);//notes리스트에 이상으로 생성한 note를 push(담는다)
    note_count++;
}

//note_num에 적절한 숫자를 넣어서 비트맵에 따라 어떤 노트를 생성할지 결정하도록 도와줌
function setNotenum() {
    fetch('seisyun_complex.json')
    .then(response => response.json())
    .then(data => {
        //console.log(data[0][0]);//테스트용으로 첫번째 데이터에 접근하는 법
        while(1) {
            if(data[note_json_col][note_json_row]==1) {
                break;
            }
            note_json_row++;
            if(note_json_row == 4) {
                break;//노트가 없는 쉼표구간
            }
            if(data[note_json_col][note_json_row] == -1) {
                game_finished = 1;//JSON의 마지막 값인 -1을 읽어들이면 게임이 끝남을 의미함
                console.log("finished");
                clearInterval(main_interval_id1);
                
                break;
            }
        }
        note_num = note_json_row;
        note_json_col++;
        note_json_row = 0;
    });
}

//노트 위치 변경
function updateNotes() {
    notes.forEach((note, index) => {
    const top = parseInt(note.style.top);//note의 top정보를 정수 변환
    note.style.top = (top + 4) + 'px';//note의 y좌표 위치를 top으로부터 4px씩 늘려 하강시킴

    //맨 위로부터 600보다 커지면(아래에 닿으면) note 제거
    if (top > 600) {
        note.remove();//노트 객체 제거
        notes.splice(index, 1);//배열 상에서 제거
    }
    });
}

//노트 판정
function checkHit(key) {
    for (let i = 0; i < notes.length; i++) {
    const note = notes[i];//i번째 노트를 참조
    const top = parseInt(note.style.top);//y좌표 위치를 top으로 계산

    //올바른 키를 눌렀으며 && top이 offset 계산식에 의해 판정 범위 내에 들어갔따면?
    if (
        note.dataset.direction === key &&
        top > 560-offset && top < 560+offset
    ) {
        score += 100;//판정에 맞으면 100점
        scoreDisplay.textContent = '점수: ' + score;//점수 변경
        note.remove();//판정을 한 것도 노트를 제거해야하는 거니까 노트 객체 제거
        notes.splice(i, 1);//배열 상에서 제거
        return;//종료
    }
    }
    score -= 50;//판정 범위 내에서 return되지 못했다면, 키를 누르지 말아야할 때에 눌렀다는 것이므로, 50점 감점
    scoreDisplay.textContent = '점수: ' + score;//점수 변경
}

document.addEventListener('keydown', (e) => {
    const key = e.key.toUpperCase();  // 소문자 → 대문자로 변환
    if (lanes.includes(key)) {
    checkHit(key);//키보드 입력이 감지되면 checkHit호출
    }
});

//노트 생성 주기에 관한 이론
//음원마다 BPM이 다르므로, 노트를 생성하는 주기가 달라야 한다.
//예를 들어 60BPM은, 1분에 4분음표가 60번 나오는 곡이다.
//4분음표마다 노트를 생성한다고 하면, 노트 생성주기 T = 60notes / 60sec = 1notes / 1sec
//즉 1초마다 노트를 생성하면 된다.
//이 곡은 190BPM이다. 1분에 4분음표가 190번 나오는 곡이다.
//4분음표마다 노트를 생성한다고 하면, 노트 생성주기 T = 190notes / 60sec = 1notes / (60 / 190)sec
//즉, 노트를 (60 / BPM)초마다 생성해야한다.
//4분음표의 경우에 이렇다는 것이고, 만약 8분음표를 생성하고 싶다면, 
//1/2만큼 짧은 간격 내에 노트를 생성해야하므로, 60의 절반인 30을 사용하여
//(30 / BPM)초 후에 노트를 생성해야한다.
//이 이론에 따라 각 음표마다 직전 음표 생성 후 다음 음표 생성 대기 시간은 아래와 같다.
//단위: 1 / BPM
//온음표: 240
//2분음표: 120
//4분음표: 60
//8분음표: 30
//16분음표: 15
//32분음표: 7.5
//64분음표: 3.75<---여기까지 갈 일이 있을까...
//이 이론을 적용해서 이하의 creating_note()함수를 편집해야한다.
//우선, 처음으로 노트가 나와야할 시간은 음원별로 다르므로 수동으로 구할 수 있도록 한다.
//아니면, 동적계산까지는 무리더라도, 음원 파일의 파형을 분석해서
//시작시간으로부터 항상 첫 박이 5초 뒤에 나오도록 하는 등 나름의 조치는 취해볼 수 있겠다.
//그 후 노트들을 생성시킬 위치와, 시간 정보를 담은 사전에 제작된 비트맵에 따라 노트를 생성한다.
//이때, 넘버맵이라 하면, 예를 들면 아래와 같은 것이다.
/*
{
    {1,0,0,0},
    {0,0,0,0},
    {0,0,0,0},
    {0,0,0,0},
    {0,1,0,0},
    {0,0,0,0},
    {0,0,1,0},
    {0,0,0,0},
    {0,0,0,0}
}
*/
//이상의 숫자 배열을 순차적으로 읽어내어 각 열은 D, F, J, K에 대응시키며
//각 행은 최소 단위인 32분음표를 의미하여
//각 행을 7.5/BPM초 마다 읽어들여 노트를 생성함을 의미한다.
function creating_note(){
    //setTimeout(createNote, 0);
    //아래 식의 두번째 인수는 ms이므로 1000을 곱해주고, 상기 언급한 32분음표 단위인 7,5를 사용할 것이고, 단위인 1/BPM을 곱한다
    main_interval_id1 = setInterval(createNote, 1000 * 7.5 / BPM);   // 0.x초마다 노트 생성<-ms 단위임을 주의하여 계산식 세울 것!
    main_interval_id2 = setInterval(updateNotes, 5);    // 5ms마다 노트 이동
}
setTimeout(creating_note, 1000);//시작 시간을 5초만큼 지연시킴.
// <--곡마다 시작시간이 다르므로 나중에 변수로 통제해주거나 파일마다 수정해줘야함
// 하드코딩 같지만? 음원 파일의 곡시작 타이밍이 다른건 개발 영역이 아니라 음악의 영역이므로 어쩔 수 없음
// 음원 파일의 파형을 분석해서 첫 박 시작 타이밍을 페이지 로드 시점을 기준으로 n초 후로 설정하고
// 노트 생성 시점 또한 n초 후로 동일하게 설정하면 동적으로 creating_note의 시작 시작을 줄 수 있을 것 같지만
// 프로젝트 기간의 한계로 차선책으로 설정하겠음