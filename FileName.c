#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#define MEASURE 2
int main()
{
	srand(time(NULL));
	int R;
	int recent = -1;
	printf("<JSON WRITER ����>\n");
	printf("1. �ڵ��� MEASURE���� �Ǻ��� ���� ���� �����Ѵ�.");
	printf("���� ���� ����Ʈ �Ǹ�,\n");
	printf("��ü �Ǻ��� 32����ǥ�� �������ٰ� �������� ��\n");
	printf("��Ʈ�� �����ϰ� ���� ���ڿ� 1�� �Է��Ѵ�.\n");
	printf("���� ���, ù �ڿ� 4����ǥ 1��,\n");
	printf("�� �ڿ� 8����ǥ 2���� �ְ�\n");
	printf("�� ���� ������ ����,\n");
	printf("�� �ڿ� 16�� ��ǥ�� 4�� �ִ� ��Ȳ�̸�\n");
	printf("1 0 0 0 0 0 0 0\n");
	printf("1 0 0 0 1 0 0 0\n");
	printf("0 0 0 0 0 0 0 0\n");
	printf("1 0 1 0 1 0 1 0\n");
	printf("�̻�� ���� �Է��ϸ� �ȴ�.");
	printf("�׸���, ���� �Ⱓ�� �Ѱ�� ���� D, F, J, KŰ �� � Ű�� ���� ����\n");
	printf("�ƽ�����, JSON WRITER�� 4���� Ű �� �������� ���ϰ� �ȴ�.");
	printf("��, ������ ���� Ű�� ������ �ʰ� �����ϵ��� �ϰڴ�.\n\n");
	printf("=============================\n");

	
	int a[MEASURE][4][8] = { 0, };
	for (int i = 0; i < MEASURE; i++) {
		printf("%d ����\n", i+1);
		printf("------------\n");
		for (int j = 0; j < 4; j++) {
			printf("%d ��: ", j+1);
			for (int k = 0; k < 8; k++) {
				scanf_s("%d", &a[i][j][k]);
			}
		}
		printf("===========================\n");
	}
	system("cls");
	printf("[\n");//JSON ���� �� ó���� ���� ���ȣ
	for (int i = 0; i < MEASURE; i++) {
		for (int j = 0; j < 4; j++) {
			for (int k = 0; k < 8; k++) {
				while (1) {
					R = rand() % 4;//0~3 ���� ��Ʈ �����
					if (R != recent) {
						//�ߺ����� ���� �� �̾Ҵٴ� ���̹Ƿ� Ż��
						recent = R;//Ż���ϱ� ���� ��� �̾Ҵ� ��� ��Ʈ ��ȣ ����
						break;
					}
				}
				if (a[i][j][k] == 0) {
					R = 4;//default ��Ȳ: ��Ʈ �������� ����
					//[0, 0, 0, 0] ����ؾ� ��
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
	printf("	[-1, -1, -1, -1]\n");//���� ��Ʈ
	printf("]");
	return 0;
}