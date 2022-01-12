# Hash Table

### [1 Two Sum](1)

Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

~~~java
class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer,Integer> map=new HashMap<>();
        int[] ret=new int[2];
        for(int i=0;i<nums.length;++i){
            if(map.containsKey(nums[i])){
                ret[0]=i;
                ret[1]=map.get(nums[i]);
                break;
            }
            map.put(target-nums[i],i);
        }
        return ret;
    }
}
~~~


### [217 Contains Duplicate](217)

Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.

```java
class Solution {
    public boolean containsDuplicate(int[] nums) {
        HashSet<Integer> set=new HashSet<>();
        for(int i=0;i<nums.length;++i){
            if(set.contains(nums[i]))
                return true;
            set.add(nums[i]);
        }
        return false;
    }
}
```


### [594 Longest Harmonious Subsequence](594)

We define a harmonious array as an array where the difference between its maximum value and its minimum value is exactly 1.

Given an integer array nums, return the length of its longest harmonious subsequence among all its possible subsequences.

A subsequence of array is a sequence that can be derived from the array by deleting some or no elements without changing the order of the remaining elements.

```java
public int findLHS(int[] nums) {
    HashMap<Integer,Integer> map=new HashMap<>();
    for(int i:nums){
        map.put(i,map.getOrDefault(i,0)+1);
    }
    int max=0;
    for(int i:map.keySet()){
        if(map.containsKey(i+1)){
            max=Math.max(max,map.get(i)+map.get(i+1));
        }
    }
    return max;
}
```