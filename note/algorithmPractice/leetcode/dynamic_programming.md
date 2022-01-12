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