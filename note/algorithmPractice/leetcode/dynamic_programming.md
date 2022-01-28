# Dynamic Programming

### [70. Climbing Stairs](70)

这题的结果实际上是斐波那契数列，每次只需用到前面2个数字，可以将前2个算出的结果存起来，减少重复计算。时间复杂度 O(n)

~~~java
class Solution {
    public int climbStairs(int n) {
        if(n<=2) return n;
        int pre1=1,pre2=2;
        int ret=0;
        for(int i=2;i<n;++i){
            ret=pre1+pre2;
            pre1=pre2;
            pre2=ret;
        }
        return ret;
    }
}
~~~

### [198. House Robber](198)

抢到当前房屋的收获最大值有2种情况，要么不抢当前的，此时最大值和抢到上一个房屋相同，要么上一个房屋不抢，此时最大值为抢到上上个房屋的最大值加上这个房屋的价值。时间复杂度 O(n)。

f(n)=max(num[n]+f(n-2), f(n-1))

~~~java
class Solution {
    public int rob(int[] nums) {
        if(nums==null || nums.length==0) return 0;
        int pre1=0,pre2=0,max=0;
        for(int i:nums){
            max=Math.max(pre1+i,pre2);
            pre1=pre2;
            pre2=max;
        }
        return max;
    }
}
~~~


### [213 House Robber II](213)

和 House Robber 类似，但是改为环形街道。取了第一个元素就不能取最后一个，取最后一个就不能取第一个，分两种情况求最优解。

```java
class Solution {
    public int rob(int[] nums) {
        if(nums==null || nums.length==0) return 0;
        if(nums.length==1) return nums[0];
        return Math.max(rob(nums,0,nums.length-2),rob(nums,1,nums.length-1));
    }
    
    private int rob(int[] nums, int begin, int end){
        int pre1=0, pre2=0, max=0;
        for(int i=begin;i<=end;++i){
            max=Math.max(pre1+nums[i],pre2);
            pre1=pre2;
            pre2=max;
        }
        return max;
    }
}
```


### [64 Minimum Path Sum](64)

```java
public int minPathSum(int[][] grid) {
    if(grid==null || grid.length==0 || grid[0].length==0) return 0;
    for(int i=1;i<grid[0].length;++i){
        grid[0][i]+=grid[0][i-1];
    }
    for(int i=1;i<grid.length;++i){
        grid[i][0]+=grid[i-1][0];
    }
    for(int i=1;i<grid.length;++i){
        for(int j=1;j<grid[i].length;++j){
            grid[i][j]+=Math.min(grid[i-1][j],grid[i][j-1]);
        }
    }
    return grid[grid.length-1][grid[0].length-1];
}
```

### [413 Arithmetic Slices](413)

如果 nums[i]-nums[i-1]=nums[i-1]-nums[i-2] ，则这是一个等差数列。如果 nums[i] 已经与前面两个数是等差数列了，而 nums[i+1] 也与前面两个数是等差数列，则新增了 2 个等差数列，如果下一个元素还是，则增加 3 个。用一个数组记录当前元素新增了几个等差数列，最后求和。

```java
public int numberOfArithmeticSlices(int[] nums) {
    int[] arr=new int[nums.length+1];
    for(int i=2;i<nums.length;++i){
        if(nums[i]-nums[i-1]==nums[i-1]-nums[i-2]){
            arr[i]=arr[i-1]+1;
        }
    }
    int total=0;
    for(int i:arr){
        total+=i;
    }
    return total;
}
```