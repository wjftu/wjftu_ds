# Graph

# [133 Clone Graph](133)

Given a reference of a node in a connected undirected graph.

Return a deep copy (clone) of the graph.

```java
class Solution {
    public Node cloneGraph(Node node) {
        if(node==null) return null;
        HashMap<Node, Node> map = new HashMap<>();
        Queue<Node> queue = new LinkedList<>();
        map.put(node, new Node(node.val));
        queue.add(node);
        while(!queue.isEmpty()){
            Node old = queue.poll();
            Node copy = map.get(old);
            for(Node n: old.neighbors){
                if(!map.containsKey(n)){
                    map.put(n, new Node(n.val));
                    queue.add(n);
                }
                copy.neighbors.add(map.get(n));
            }
        }
        return map.get(node);
    }
}
```