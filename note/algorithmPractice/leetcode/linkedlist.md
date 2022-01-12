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