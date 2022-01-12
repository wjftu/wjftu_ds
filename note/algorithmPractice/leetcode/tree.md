# Tree

树，基本是用递归来做。

### [94 Binary Tree Inorder Traversal](94)


~~~java
import java.util.LinkedList;
class Solution {
    List<Integer> list;
    public List<Integer> inorderTraversal(TreeNode root) {
        
        list=new LinkedList<>();
        if(root==null) return list;
        inOrder(root);
        return list;
    }
    public void inOrder(TreeNode t){
        if(t.left!=null) inOrder(t.left);
        list.add(t.val);
        if(t.right!=null) inOrder(t.right);
    }
}
~~~

### [100 Same Tree](100)

~~~java
class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        if(p==null && q==null) return true;
        if(p==null || q==null) return false;
        return p.val==q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}
~~~

### [104 Maximum Depth of Binary Tree](104)

~~~java
class Solution {
    public int maxDepth(TreeNode root) {
        if(root==null) return 0;
        return Math.max(maxDepth(root.left),maxDepth(root.right))+1;
    }
}
~~~

### [110 Balanced Binary Tree](110)

~~~java
class Solution {
    boolean isBal=true;
    public boolean isBalanced(TreeNode root) {
        height(root);
        return isBal;
    }
    
    private int height(TreeNode t){
        if(t==null) return 0;
        int height1=height(t.left);
        int height2=height(t.right);
        if(Math.abs(height1-height2)>1) isBal=false;
        return Math.max(height1,height2)+1;
    }
}
~~~


### [226 Invert Binary Tree](226)

~~~java
class Solution {
    public TreeNode invertTree(TreeNode root) {
        if(root==null) return null;
        TreeNode t=root.left;
        root.left=root.right;
        root.right=t;
        invertTree(root.left);
        invertTree(root.right);
        return root;
    }
}
~~~

### [543 Diameter of Binary Tree](543)

最大的距离为某个节点的左子树深度加上右子树深度

~~~java
class Solution {
    int max=0;
    public int diameterOfBinaryTree(TreeNode root) {
        depth(root);
        return max;
    }
    
    private int depth(TreeNode t){
        if(t==null) return 0;
        int left=depth(t.left);
        int right=depth(t.right);
        max=max>left+right?max:left+right;
        return Math.max(left,right)+1;
    }
}
~~~

### [617 Merge Two Binary Trees](617)


~~~java
class Solution {
    public TreeNode mergeTrees(TreeNode root1, TreeNode root2) {
        if(root1==null && root2==null) return null;
        
        if(root1!=null && root2!=null){
            TreeNode nNode=new TreeNode(root1.val+root2.val);
            nNode.left=mergeTrees(root1.left,root2.left);
            nNode.right=mergeTrees(root1.right,root2.right);
            return nNode;
        }
        return root1==null?root2:root1;
    }
}
~~~

