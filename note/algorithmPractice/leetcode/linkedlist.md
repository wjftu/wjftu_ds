# Linked List

### [2 Add Two Numbers](2)

~~~java
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode ret,p;
        int carry=0;
        ret=new ListNode((l1.val+l2.val)%10);
        p=ret;
        carry=(l1.val+l2.val)/10;
        l1=l1.next; l2=l2.next;
        while(l1!=null && l2!=null){
            p.next=new ListNode((l1.val+l2.val+carry)%10);
            p=p.next;
            carry=(l1.val+l2.val+carry)/10;
            l1=l1.next; l2=l2.next;
        }
        while(l1!=null){
            p.next=new ListNode((l1.val+carry)%10);
            p=p.next;
            carry=(l1.val+carry)/10;
            l1=l1.next;
        }
        while(l2!=null){
            p.next=new ListNode((l2.val+carry)%10);
            p=p.next;
            carry=(l2.val+carry)/10;
            l2=l2.next;
        }
        if(carry==1)
            p.next=new ListNode(1);
        return ret;
    }
}
~~~

### [160 Intersection of Two Linked Lists](160)

Given the heads of two singly linked-lists headA and headB, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return null.

```java
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode p1=headA, p2=headB;
        int count=0;
        while(p1 != p2){
            if(p1.next==null){
                p1=headB;
                ++count;
                if(count>1) return null;
            } else {
                p1=p1.next;
            }
            p2=p2.next!=null? p2.next:headA;
        }
        return p1;
    }
}
```

### [206 Reverse Linked List](206)

Given the head of a singly linked list, reverse the list, and return the reversed list.


```java
class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode h = new ListNode();
        ListNode t;
        while(head != null){
            t=head.next;
            head.next=h.next;
            h.next=head;
            head=t;
        }
        return h.next;
    }
}
```