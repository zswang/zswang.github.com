Java匿名对象传参
====

```java
public abstract interface Runnable {
    public abstract void run();
}

public class Handler {
    public void post(Runnable runnable) {
        // ....
    }
}

new Handler(new Runnable() {
    private int mLeft;
    private int mTop;
    @Override
    public run() {
        // ....
    }
    public config(int left, int top) {
        mLeft = left;
        mTop = top
    }
}.config(100, 200));

```
