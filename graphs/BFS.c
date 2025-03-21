#include<stdio.h>
#include<stdlib.h>
#define size 100
#define white 2
#define gray 1
#define black 0
int q[size];
int rear=-1,front=-1;
void enqueue(int s)
{
   if (rear==size-1)
   {
      printf("no space to enqueue");
   }
   else
   {
      rear++;
      q[rear]=s;
   }
}
int dequeue()
{
   if (rear==-1 || front==rear)
   {
      return -1;
   }
   else
   {
      front++;
      return q[front];
   }
}
int BFS(int g[4][4],int s)
{
   int u,v,d[100],prec[100],color[100];
   for (u=0;u<=v;u++)
   {
      color[u]=white;
      d[u]=100000;
      prec[u]=gray;
   }
   color[s]=gray;
   d[s]=0;
   prec[s]=NULL;
   q[rear]=-1;
   enqueue(s);
   while (rear==-1 || front==rear)
   {
       u=dequeue();
       for (v=0;v<=g[u][4];v++)
       {
           if (color[v]==white)
           {
               color[v]=gray;
               d[v]=d[u]+1;
               prec[v]=u;
               enqueue(v);
           }
       }
       color[u]=black;
       printf("color:%d",color[v]);
       printf("distance:%d",d[v]);
       printf("path:%d",prec[v]);
   }
}
int main()
{
   int i,j,s;
   int g[4][4]= { {0,1,1,0},{1,0,1,0},{1,1,0,1},{0,0,1,0} };
   for (i=0;i<4;i++)
   {
      for (j=0;j<4;j++)
      {
         s=
         BFS(g,s);
      }
   }
}
