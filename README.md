# HYPER

## Example Programs

<table>
  <tr>
  <th>HYPER!</th>
  <th>JavaScript</th>
  </tr>

  <tr>
  <td>

```
SAY "HELLO!"!
```

  </td>

  <td>

```javascript
console.log('HELLO!')
```

  </td>

  </tr>
</table>


<table>
  <tr>
  <th>HYPER!</th>
  <th>JavaScript</th>
  </tr>

  <tr>
  <td>

```
FUNC fibonacci( INT num) ~  
    DOES num == 0 ~
        GIMME 0!
    OR DOES num == 1 OR num == 2 ~ 
        GIMME 1!
    
    SAY fibonacci(num-2) + fibonacci(num-1)!
```

  </td>

  <td>

```python
def fibonacci(num): 
    if num == 0: 
        return 0
    if num == 1 or num == 2:
        return 1
    return fibonacci(num - 2) + fibonacci(num - 1)
```

  </td>

  </tr>
</table>
