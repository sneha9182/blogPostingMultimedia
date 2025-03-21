#include <stdio.h>
#include <stdlib.h>
#define size 8
int array[size];
struct node
{
    int data;
    struct node *next;
};
int queue[size];
int front = -1, rear = -1;
int stack[size];
int f = -1;
void push(int value)
{
    stack[++f] = value;
}
int pop()
{
    return stack[f--];
}
int empty()
{
    if (front == -1)
        return 1;
    else
        return 0;
}
int full()
{
    if (front > rear || (front == 0 && rear == size - 1))
        return 1;
    else
        return 0;
}
void Enqueue(int value)
{
        if (front == -1)
            front = 0;
        rear = (rear + 1) % size;
        queue[rear] = value;
}
int Dequeue()
{
        int element = queue[front];
        if (front == rear)
        {
            front = -1;
            rear = -1;
        }
        else
            front = (front + 1) % size;
        return element;
}
void bfs(int row, int column, int a[row][column])
{
    int h, k;
    printf("Enter the edges:\n");
    scanf("%d,%d", &h, &k);

    a[h][k] = 1;
    a[k][h] = 1;
    for (int i = 0; i < row; i++)
    {

        for (int j = 0; j < column; j++)
        {
            if (a[i][j] != 1)
            {
                a[i][j] = 0;
            }
        }
        printf("\n");
    }
}

void traverse(int row, int column, int a[row][column])
{
    struct node *head = NULL;
    int node;
    int visited[row], parent[row], distance[row];
    for (int i = 0; i < row; i++)
        visited[i] = 0;
    int i;
    printf("where you want to trace the source element:");
    scanf("%d", &i);
    printf("%d ", i);
    visited[i] = 1;
    distance[i] = 0;
    parent[i] = -1;
    Enqueue(i); // for exploration 
    while (!empty())
    {
        int node = Dequeue();
        for (int j = 0; j < row; j++)
        {
            if (a[node][j] == 1 && visited[j] == 0)
            {
                distance[j] = distance[node] + 1;
                parent[j] = node;
                printf("%d ", j);
                visited[j] = 1;
                Enqueue(j);
            } 
        }
    }
    printf("\n***Shortest distance from the given source node***\n");

    for (int i = 0; i < row; i++)
    {
        printf("%d ", distance[i]);
    }

    int dest;
    printf("\nparent:\n");

    for (int i = 0; i < row; i++)
    {
        printf(" %d ", parent[i]);
    }

    printf("\nEnter the dest:\n");
    scanf("%d", &dest);

    if (visited[dest] == 0)
        printf("No Path!!!");

    else
    {
    printf("\n***Shortest path from the given source node***\n");
        int x = dest,count = 0;
        while (x != -1)
        {
            Enqueue(x);
            x = parent[x];
            int path = Dequeue();
            push(path);
            count++;
        }
        while (count>0)
        {
            int path = pop();
            printf("%d-->", path);
            count--;
        }
    }
}
void display(int row, int column, int a[row][column])
{
    for (int i = 0; i < row; i++)
    {
        for (int j = 0; j < row; j++)
        {
            printf("%d ", a[i][j]);
        }
        printf("\n");
    }
} 

int main()
{
    int row, column;
    printf("Enter the number of nodes!!!\n");
    scanf("%d", &row);
    int arr[row];
    column = row;
    int a[row][column];
    for (int i = 0; i < row; i++)
    {

        for (int j = 0; j < column; j++)
        {
            a[i][j] = 0;
        }
        printf("\n");
    }
    while (1)
    {
        printf("\n***ENTER THE BELOW OPERATION***\n");
        printf("1.addEdges\n2.Traverse By A Source Vertex\n3.Display\n4.Parent vertex\n5.exit()\n");
        int choice;
        scanf("%d", &choice);
        switch (choice)
        {
        case 1:
            bfs(row, column, a);
            break;
        case 2:
            traverse(row, column, a);
            break; 
        case 3:
            display(row, column, a);
            break;
        case 5:
            exit(0);
        default:
            printf("Enter the valid input from the user!!!!");
        }
    }
    return 0;
}


