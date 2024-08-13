package sealights.notes.sealights;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class FunctionsTest {

    @Test
    void testSubtraction() {
        assertEquals(1, functions.subtracttwonumbers(3, 2));
    }

    @Test
    void testMultiplication() {
        assertEquals(6, functions.multiplytwonumbers(2, 3));
    }

    @Test
    void testDivision() {
        assertEquals(2.0, functions.dividetwonumbers(4, 2));
    }

    @Test
    void testDivisionByZero() {
        assertThrows(IllegalArgumentException.class, () -> functions.dividetwonumbers(4, 0));
    }
}
