# Binary Search

### [69 Sqrt(x)](69)

Given a non-negative integer x, compute and return the square root of x.

Since the return type is an integer, the decimal digits are truncated, and only the integer part of the result is returned.

```java
public int mySqrt(int x) {
    if(x<=1) return x;
    int low=0,high=x;
    int mid,num;
    while(low<=high){
        mid = (low+high)/2;
        num=x/mid;
        if(num<mid){
            high = mid-1;
        } else if(num > mid){
            low = mid+1;
        } else {
            return mid;
        }
    }
    return high;
}
```

### [744 Find Smallest Letter Greater Than Target](744)

Given a characters array letters that is sorted in non-decreasing order and a character target, return the smallest character in the array that is larger than target.

Note that the letters wrap around.

```java
public char nextGreatestLetter(char[] letters, char target) {
    int low=0,high=letters.length;
    int mid;
    char c;
    while(low<high){
        mid=(low+high)/2;
        c=letters[mid];
        if(c<=target){
            low=mid+1;
        } else {
            high=mid;
        }
    }
    return low==letters.length?letters[0]:letters[low];
}
```


### [540 Single Element in a Sorted Array](540)

You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once.

Return the single element that appears only once.

Your solution must run in O(log n) time and O(1) space.

```java
public int singleNonDuplicate(int[] nums) {
    int low = 0, high = nums.length-1;
    int mid, n;
    while(low<high){
        mid = (low+high)/2;
        n = mid ^ 1;
        if(nums[mid] == nums[n]){
            low = mid + 1;
        } else {
            high = mid;
        }
        
    }
    return nums[low];
}
```