## Testing

1. Testing a class by using another method within the class. How to refactor the class or the test to avoid this situation?
   
   Example -  For Queue class, different methods can be tested only by using the `print` method. As a consequence the tests are not strictly isolated and can fail if `print` method fails.