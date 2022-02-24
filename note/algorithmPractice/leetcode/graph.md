# Graph

### [133 Clone Graph](133)

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


### [200 Number of Islands](200)

Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.

```java
class Solution {
    public int numIslands(char[][] grid) {
        int count=0;
        for(int i=0;i<grid.length;++i){
            for(int j=0;j<grid[0].length;++j){
                if(grid[i][j]=='1') {
                    remove(grid, i, j);
                    count++;
                }
            }
        }
        return count;
    }
    
    private void remove(char[][] grid, int i, int j){
        grid[i][j]='0';
        if(i+1<grid.length && grid[i+1][j]=='1') remove(grid, i+1, j);
        if(i-1>=0 && grid[i-1][j]=='1') remove(grid, i-1, j);
        if(j+1<grid[0].length && grid[i][j+1]=='1') remove(grid, i, j+1);
        if(j-1>=0 && grid[i][j-1]=='1') remove(grid, i, j-1);
    }
}
```