#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#define MEASURE 2
int main()
{
	srand(time(NULL));
	int R;
	int recent = -1;
	printf("<JSON WRITER 사용법>\n");
	printf("1. 코드의 MEASURE값을 악보의 마디 수로 수정한다.");
	printf("마디 수가 프린트 되면,\n");
	printf("전체 악보를 32분음표로 나누었다고 가정했을 때\n");
	printf("노트를 생성하고 싶은 박자에 1을 입력한다.\n");
	printf("예를 들어, 첫 박에 4분음표 1개,\n");
	printf("두 박에 8분음표 2개가 있고\n");
	printf("세 박은 완전히 쉬고,\n");
	printf("네 박에 16분 음표가 4개 있는 상황이면\n");
	printf("1 0 0 0 0 0 0 0\n");
	printf("1 0 0 0 1 0 0 0\n");
	printf("0 0 0 0 0 0 0 0\n");
	printf("1 0 1 0 1 0 1 0\n");
	printf("이상과 같이 입력하면 된다.");
	printf("그리고, 개발 기간의 한계로 인해 D, F, J, K키 중 어떤 키로 정할 지는\n");
	printf("아쉽지만, JSON WRITER가 4개의 키 중 랜덤으로 정하게 된다.");
	printf("단, 직전에 나온 키만 나오지 않게 조정하도록 하겠다.\n\n");
	printf("=============================\n");

	
	int a[MEASURE][4][8] = { 0, };
	for (int i = 0; i < MEASURE; i++) {
		printf("%d 마디\n", i+1);
		printf("------------\n");
		for (int j = 0; j < 4; j++) {
			printf("%d 박: ", j+1);
			for (int k = 0; k < 8; k++) {
				scanf_s("%d", &a[i][j][k]);
			}
		}
		printf("===========================\n");
	}
	system("cls");
	printf("[\n");//JSON 파일 맨 처음에 여는 대괄호
	for (int i = 0; i < MEASURE; i++) {
		for (int j = 0; j < 4; j++) {
			for (int k = 0; k < 8; k++) {
				while (1) {
					R = rand() % 4;//0~3 랜덤 노트 만들기
					if (R != recent) {
						//중복되지 않은 걸 뽑았다는 것이므로 탈출
						recent = R;//탈출하기 전에 방금 뽑았던 기록 노트 번호 저장
						break;
					}
				}
				if (a[i][j][k] == 0) {
					R = 4;//default 상황: 노트 생성하지 않음
					//[0, 0, 0, 0] 출력해야 함
				}
				switch (R)
				{
					case 0:
						printf("	[1, 0 ,0 ,0],\n");
						break;
					case 1:
						printf("	[0, 1, 0, 0],\n");
						break;
					case 2:
						printf("	[0, 0, 1, 0],\n");
						break;
					case 3:
						printf("	[0, 0, 0, 1],\n");
						break;
					default:
						printf("	[0, 0, 0, 0],\n");
						break;
				}
			}
			printf("\n");
		}
	}
	printf("	[-1, -1, -1, -1]\n");//종료 노트
	printf("]");
	return 0;
}